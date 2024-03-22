#!/usr/bin/env node

import { program, Argument, Option, InvalidArgumentError } from "commander"
import { validate } from "./commands.js"

main().catch((error) => {
  console.error(error)
})

async function main() {
  program
    .argument("<filepath>", "filepath to validate")
    .addArgument(new Argument("<version>").choices(["v2.0", "v2.0.0"]))
    .addOption(
      new Option("-f, --format <string>", "file format of file").choices([
        "csv",
        "json",
      ])
    )
    .option(
      "-e, --error-limit <value>",
      "maximum number for errors and warnings",
      ensureInt,
      1000
    )
    .action(validate)

  program.parseAsync(process.argv)
}

function ensureInt(value: string) {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Must be a number.")
  }
  return parsedValue
}
