# Advent of Code for TypeScript

## Intro

This repo contains environment for running [Advent of Code](https://adventofcode.com) challenges, with:

- automatic creation of a challenge template,
- automatic execution of a challenge code (with reloads),
- quick utils for testing and reading input from a file.

## Running dev mode

Run current day

```
bun run start
```

Run specified day

```
bun run dev --day 20 --year 2019
```

If the day folder does not exist, it will be created from template.
