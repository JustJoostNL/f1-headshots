import { LIVETIMING_BASE_URL, LIVETIMING_FALLBACK_BASE_URL } from "./const";
import type { IYearResponse } from "./types/livetiming";

export async function fetchLiveTiming<T>(path: string): Promise<T> {
  const url = new URL(LIVETIMING_BASE_URL);
  url.pathname = path;

  const response = await fetch(url.toString());

  if (!response.ok) {
    const fallbackUrl = new URL(LIVETIMING_FALLBACK_BASE_URL);
    fallbackUrl.pathname = path;
    const fallbackResponse = await fetch(fallbackUrl.toString());

    if (!fallbackResponse.ok) {
      throw new Error(`Failed to fetch from both primary and fallback URLs.`);
    }

    return await fallbackResponse.json();
  }

  return await response.json();
}

export async function getYearIndex(year: number): Promise<IYearResponse> {
  return await fetchLiveTiming<IYearResponse>(`static/${year}/Index.json`);
}

export async function getAllYearIndexes(
  years: number[],
): Promise<IYearResponse[]> {
  console.log(`Fetching year indexes for years: ${years.join(", ")}...`);
  const promises = years.map((year) => getYearIndex(year));
  return await Promise.all(promises);
}

export function driverListPathsFromIndex(yearIndex: IYearResponse): string[] {
  return yearIndex.Meetings.flatMap((meeting) =>
    meeting.Sessions.map((session) => {
      return `static/${session.Path}DriverList.json`;
    }),
  );
}
