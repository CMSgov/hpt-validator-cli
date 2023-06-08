#!/usr/bin/env node

import { program, Option } from "commander"
import { validate } from "./commands.js"

main().catch((error) => {
  console.error(error)
})

async function main() {
  program
    .argument("<filepath>", "filepath to validate")
    .addOption(
      new Option("-f, --format <string>", "file format of file").choices([
        "csv",
        "json",
      ])
    )
    .action(validate)

  program.parseAsync(process.argv)
}
