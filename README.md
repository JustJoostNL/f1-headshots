# F1 Headshots

> Automated tool to fetch and organize Formula 1 driver headshot images from official F1 sources.

This project discovers all F1 drivers from multiple seasons using F1's livetiming API, then checks and downloads their official headshot photos across different years. It handles the fact that drivers may have different headshots published for different seasons.

## Features

- 🏎️ Fetches driver data from the livetiming API
- 🖼️ Downloads official F1 driver headshots from formula1.com
- 📅 Checks all year variations for each driver
- 🗂️ Organizes images by year and provides both TLA and reference lookups
- 📊 Generates JSON mapping of available headshots per driver
- ⚡ Efficient parallel processing for fast downloads

## Output Structure

```
out/
├── headshots.json          # JSON mapping: { "HAM": { 2024: "url", 2023: "url" } }
└── headshots/
    ├── 2025/
    │   ├── HAM.png         # By three-letter code
    │   ├── VER.png
    │   └── by_ref/
    │       ├── LEWHAM01.png  # By reference name
    │       └── MAXVER01.png
    ├── 2024/
    └── ...
```

## Installation

```bash
bun install
```

## Usage

```bash
bun run start
```

The script will:
1. Fetch all driver lists from F1 livetiming for configured years
2. Build a complete list of unique driver references
3. Check existence of headshots across all year/driver combinations
4. Download valid headshots and organize them by year
5. Generate a JSON index of all available headshots

## Configuration

Edit [src/const.ts](src/const.ts) to customize:
- `livetimingYears` - Years to fetch driver data from
- `headshotYears` - Years to check for headshot availability
- `OUT_DIR` - Output directory for downloaded files

## Requirements

- [Bun](https://bun.sh/) runtime

## License

GPL-3.0
