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

type FileFormat = "csv" | "json"

export async function validate(
  filepath: string,
  version: string,
  options: { [key: string]: string | number }
) {
  const format = getFileFormat(filepath, options)
  if (!format) {
    console.log(
      "This is not a valid file type. Files must be in a required CMS template format (.json or .csv)"
    )
    return
  }

  const inputStream = filepath.endsWith(".gz")
    ? fs
        .createReadStream(filepath)
        .pipe(zlib.createGunzip())
        .setEncoding("utf-8")
    : fs.createReadStream(filepath, "utf-8")

  const validationResult = await validateFile(
    inputStream,
    version,
    format as FileFormat,
    {
      maxErrors: options.errorLimit as number,
    }
  )
  inputStream.close()
  if (!validationResult) return

  const errors = validationResult.errors

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
}

async function validateFile(
  inputStream: fs.ReadStream | NodeJS.ReadableStream,
  version: string,
  format: FileFormat,
  validatorOptions: CsvValidationOptions | JsonValidatorOptions
): Promise<ValidationResult | null> {
  const schemaVersion = version as "v1.1" | "v2.0"
  if (format === "csv") {
    return await validateCsv(
      inputStream,
      schemaVersion,
      validatorOptions as CsvValidationOptions
    )
  } else if (format === "json") {
    return await validateJson(
      inputStream,
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

  if (filepath.endsWith(".gz")) {
    filepath = filepath.slice(0, -3)
  }

  const fileExt = path.extname(filepath).toLowerCase().replace(".", "")
  if (["csv", "json"].includes(fileExt)) {
    return fileExt as FileFormat
  }

  return null
}
