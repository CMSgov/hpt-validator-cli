#!/usr/bin/env node

import { Argument, Option, InvalidArgumentError, Command } from "commander"
import { validate } from "./commands.js"
import { getVersionInfo } from "./version.js"
import * as semver from "semver"

const HELP_TEXT = `
This tool validates CSV and JSON files against the CMS requirements.
- v2.1 represents the July 2024 requirements.
- v2.2 represents the January 2025 requirements.
- v3.0 represents the April 2026 requirements.
See https://github.com/CMSgov/hospital-price-transparency for information about these requirements.
`
const VERSION_CHOICES = ["v2.1", "v2.2", "v3.0"]

main().catch((error) => {
  console.error(error)
})

async function main() {
  const program = new Command()
    .name("cms-hpt-validator")
    .showHelpAfterError(HELP_TEXT)

  program
    .version(getVersionInfo(), undefined, "output the CLI version number")
    .argument("<filepath>", "filepath to validate")
    .addArgument(
      new Argument(
        "<version>",
        "version of data dictionary requirements to validate against"
      )
        .choices(VERSION_CHOICES)
        .argParser(adjustVersionChoice)
    )
    .addOption(
      new Option("-f, --format <string>", "file format of file").choices([
        "csv",
        "json",
      ])
    )
    .addOption(
      new Option("-o, --output <string>", "output format")
        .choices(["table", "json"])
        .default("table")
    )
    .option(
      "-e, --error-limit <value>",
      "maximum number for errors",
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

// be a little more forgiving about what the user entered for their version choice
// a user may have entered only a major version, or may have included a patch version.
// but what we want to do is figure out which minor version matches their input,
// and use that to decide what to send along to the validator.
// the validator expects to get a version that includes patch, but we should always
// use the latest patch for a given minor version, regardless of what the user entered.

function adjustVersionChoice(this: Option, value: string) {
  const providedVersion = semver.coerce(value)
  const containsDot = value.includes(".")
  if (providedVersion == null) {
    throw new InvalidArgumentError(
      `Allowed choices are ${(this.argChoices ?? []).join(", ")}.`
    )
  }
  if (containsDot) {
    // if the input contains a dot, the user probably provided at least a major and minor version.
    // try to use the specified major and minor versions.
    if (semver.satisfies(providedVersion.version, "3.0.*")) {
      return "3.0.0"
    } else if (semver.satisfies(providedVersion.version, "2.2.*")) {
      return "2.2.0"
    } else if (semver.satisfies(providedVersion.version, "2.1.*")) {
      return "2.1.0"
    }
  } else {
    // if the input does not contain a dot, the user probably provided only a major version.
    // in this case, we want to use the latest minor version for the given major version.
    if (semver.satisfies(providedVersion.version, "3.*")) {
      return "3.0.0"
    } else if (semver.satisfies(providedVersion, "2.*")) {
      return "2.2.0"
    }
  }
  throw new InvalidArgumentError(
    `Allowed choices are ${(this.argChoices ?? []).join(", ")}.`
  )
}

// if (!this.argChoices.includes(arg)) {
//         throw new InvalidArgumentError(
//           `Allowed choices are ${this.argChoices.join(', ')}.`,
//         );
//       }
