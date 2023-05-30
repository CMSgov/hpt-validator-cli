import fs from "fs"
import path from "path"
import chalk from "chalk"
import { validateFilename, validateCsv, validateJson } from "hpt-validator"
import { ValidationResult } from "hpt-validator/src/types"
import { InvalidArgumentError } from "commander"

type FileFormat = "csv" | "json"

export async function validate(
  filepath: string,
  options: { [key: string]: string }
) {
  const format = getFileFormat(filepath, options)
  if (!format) {
    throw new InvalidArgumentError(
      `Unable to parse format from arguments or filepath: ${filepath}`
    )
  }

  if (validateFilename(path.basename(filepath))) {
    console.log(chalk.green("Filename valid"))
  } else {
    console.log(chalk.red("Filename invalid"))
  }

  const validationResult = await validateFile(filepath, format as FileFormat)
  if (!validationResult) return

  const errors = validationResult.errors.filter(({ warning }) => !warning)
  const warnings = validationResult.errors.filter(({ warning }) => warning)

  if (errors.length > 0) {
    console.log(
      chalk.red(
        `${errors.length === 1 ? "1 error" : `${errors.length} errors`} found`
      )
    )
    console.table(errors)
  } else {
    console.log(chalk.green("No errors found"))
  }
  if (warnings.length > 0) {
    console.log(
      chalk.yellow(
        `${
          warnings.length === 1 ? "1 warning" : `${warnings.length} warnings`
        } found`
      )
    )
    console.table(warnings)
  } else {
    console.log(chalk.green("No warnings found"))
  }
}

async function validateFile(
  filename: string,
  format: FileFormat
): Promise<ValidationResult | null> {
  if (format === "csv") {
    return await validateCsv(fs.createReadStream(filename, "utf-8"))
  } else if (format === "json") {
    return await validateJson(fs.createReadStream(filename, "utf-8"))
  } else {
    return null
  }
}

function getFileFormat(
  filepath: string,
  fileFormat: { [key: string]: string }
): FileFormat | null {
  if (fileFormat.format) return fileFormat.format as FileFormat

  const fileExt = path.extname(filepath).toLowerCase().replace(".", "")
  if (["csv", "json"].includes(fileExt)) {
    return fileExt as FileFormat
  }

  return null
}
