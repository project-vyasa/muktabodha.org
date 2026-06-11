# Muktabodha.org Data Pipeline

This repository contains a TypeScript data pipeline to process and clean scriptural source data. 

**Credit and Attribution:**
All source data processed by this repository is sourced from the **Muktabodha Indological Research Institute** (muktabodha.org). We are deeply grateful to Muktabodha for making these digital archives of classical Indian texts available.

## Purpose
The primary goal is to:
1. Extract source material from various generations of digital formats.
2. Clean the data (e.g. separate core verses from commentary).
3. Provide robust transliteration capabilities (e.g. IAST to Devanagari) to verify and standardize the content.

## Setup
Install dependencies using Bun:
```sh
bun install
```

## Running Scripts
Scripts are located in `src/`.
```sh
bun run src/extract.ts
bun run src/clean.ts
bun run src/transliterate.ts
```
