import fs from "fs"
import path from "path"
import chalk from "chalk"
import zlib from "zlib"
import {
  CsvValidationOptions,
  JsonValidatorOptions,
  validateCsv,
  validateJson,
} from "hpt-validator"
import { ValidationResult } from "hpt-validator/src/types"
import { InvalidArgumentError } from "commander"

type FileFormat = "csv" | "json" | "json.gz" | "csv.gz"

export async function validate(
  filepath: string,
  version: string,
  options: { [key: string]: string | number }
) {
  const format = getFileFormat(filepath, options)
  if (!format) {
    throw new InvalidArgumentError(
      `Unable to parse format from arguments or filepath: ${filepath}`
    )
  }

  const validationResult = await validateFile(
    filepath,
    version,
    format as FileFormat,
    {
      maxErrors: options.errorLimit as number,
    }
  )
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
  version: string,
  format: FileFormat,
  validatorOptions: CsvValidationOptions | JsonValidatorOptions
): Promise<ValidationResult | null> {
  const schemaVersion = version as "v1.1" | "v2.0"
  const reader = format.endsWith(".gz") 
    ? fs.createReadStream(filename).pipe(zlib.createGunzip()).setEncoding("utf-8")
    : fs.createReadStream(filename, "utf-8")
    ;

  if (format === "csv" || format === "csv.gz") {
    return await validateCsv(
      reader,
      schemaVersion,
      validatorOptions as CsvValidationOptions
    )
  } else if (format === "json" || format === "json.gz") {
    return await validateJson(
      reader,
      schemaVersion,
      validatorOptions as JsonValidatorOptions
    )
  } else {
    return null
  }
}

function getFileFormat(
  filepath: string,
  fileFormat: { [key: string]: string | number }
): FileFormat | null {
  if (fileFormat.format) return fileFormat.format as FileFormat

  const isGzipped = path.extname(filepath).toLowerCase() === ".gz"
  const fileExt = path.extname(path.basename(filepath, isGzipped ? ".gz" : ""))
  switch (fileExt) {
    case ".csv":
      return (isGzipped ? "csv.gz" : "csv") as FileFormat
    case ".json":
      return (isGzipped ? "json.gz" : "json") as FileFormat
    default:
      return null;
  }
}
