import Bun from "bun";
import { headshotYears, livetimingYears, OUT_DIR } from "./const";
import {
  driverListPathsFromIndex,
  fetchLiveTiming,
  getAllYearIndexes,
} from "./livetiming";
import type { IDriverListResponse } from "./types/livetiming";

const headshotTemplateUrl =
  "https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/drivers/{year}/{ref}.png";

async function checkHeadshotExists(url: string): Promise<boolean> {
  const response = await fetch(url, { method: "HEAD" });
  return response.ok;
}

async function main() {
  console.log("Starting driver headshot script...");
  const yearIndexes = await getAllYearIndexes(livetimingYears);
  const driverListUrls = yearIndexes.flatMap(driverListPathsFromIndex);

  console.log(`Fetching ${driverListUrls.length} driver lists...`);
  const driverLists = await Promise.allSettled(
    driverListUrls.map((url) => fetchLiveTiming<IDriverListResponse>(url)),
  );

  const refToTla = new Map<string, string>();
  for (const result of driverLists) {
    if (result.status === "fulfilled") {
      for (const driver of Object.values(result.value)) {
        if (driver.Reference) refToTla.set(driver.Reference, driver.Tla);
      }
    }
  }

  console.log(`Found ${refToTla.size} unique driver references.`);

  const headshots = headshotYears.flatMap((year) =>
    [...refToTla.entries()].map(([ref, tla]) => ({
      year,
      ref,
      tla,
      url: headshotTemplateUrl
        .replace("{year}", year.toString())
        .replace("{ref}", ref),
    })),
  );

  console.log(`Checking existence of ${headshots.length} headshot URLs...`);

  const headshotChecks = await Promise.allSettled(
    headshots.map((h) => checkHeadshotExists(h.url)),
  );
  const existingHeadshots = headshots.filter(
    (_, i) =>
      headshotChecks[i].status === "fulfilled" && headshotChecks[i].value,
  );

  console.log(`Found ${existingHeadshots.length} valid headshots.`);

  const jsonData: { [tla: string]: { [year: number]: string } } = {};
  for (const { tla, year, url } of existingHeadshots) {
    if (!jsonData[tla]) jsonData[tla] = {};
    jsonData[tla][year] = url;
  }

  const jsonPath = `${OUT_DIR}/headshots.json`;
  await Bun.write(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(`Saved headshots data to ${jsonPath}`);

  console.log(`Downloading headshots to ${OUT_DIR}/headshots/ ...`);

  await Promise.all(
    existingHeadshots.map(async ({ year, ref, tla, url }) => {
      const response = await fetch(url);
      const data = new Uint8Array(await response.arrayBuffer());
      await Promise.all([
        Bun.write(`${OUT_DIR}/headshots/${year}/${tla}.png`, data),
        Bun.write(`${OUT_DIR}/headshots/${year}/by_ref/${ref}.png`, data),
      ]);
    }),
  );

  console.log(`Downloaded headshots to ${OUT_DIR}/headshots/`);
}

main();
