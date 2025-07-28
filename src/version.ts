import path from "path"
import fs from "fs"
import { EOL } from "os"
import { execSync } from "child_process"
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function getVersionInfo(): string {
  const installedVersion = getLocalVersion()
  const latestVersion = getLatestPublishedVersion()
  const validatorVersion = getValidatorVersion()
  return [
    `Current CLI version: ${installedVersion ?? "unknown"}`,
    `Latest CLI version: ${latestVersion ?? "unknown"}`,
    `Using @cmsgov/hpt-validator version: ${validatorVersion ?? "unknown"}`,
  ].join(EOL)
}

function getLocalVersion(): string | undefined {
  const packageJSONPath = path.join(__dirname, "..", "package.json")
  if (fs.existsSync(packageJSONPath)) {
    try {
      return JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"))?.version
    } catch {
      return
    }
  }
  return
}

export function getValidatorVersion(): string | undefined {
  const packageJSONPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "@cmsgov",
    "hpt-validator",
    "package.json"
  )
  if (fs.existsSync(packageJSONPath)) {
    try {
      return JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"))?.version
    } catch {
      return
    }
  }
  return
}

function getLatestPublishedVersion(): string | undefined {
  let latestVersion: string | undefined = undefined
  const versionCheckCommand = "npm view @cmsgov/hpt-validator-cli version"
  try {
    const execResult = execSync(versionCheckCommand)
      .toString()
      .replace(/\s*$/, "")
    if (execResult.match(/^[0-9\.]*$/)) {
      latestVersion = execResult
    }
  } catch (e) {
    console.error(e)
  }
  return latestVersion
}
