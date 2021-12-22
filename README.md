# Advent of Code for TypeScript

## Intro

This repo contains environment for running [Advent of Code](https://adventofcode.com/2019) challenges, with:

- automatic creation of a challenge template,
- automatic execution of a challenge code (with reloads),
- quick utils for testing and reading input from a file.

## Running dev mode

Run current day
```
npm run singleDay
```

Run specified day
```
npm run singleDay -- --day 20 --year 2019
```

To debug use "singleDay:debug" instead

If the day folder does not exist, it will be created from template.
