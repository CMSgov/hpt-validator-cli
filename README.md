# Hospital Price Transparency CLI Validator

[![Version](https://img.shields.io/npm/v/@cmsgov/hpt-validator-cli)](https://www.npmjs.com/package/@cmsgov/hpt-validator-cli)

CLI for validating CMS Hospital Price Transparency machine-readable files

## Getting Started

### Prerequisites

These were the minimum versions used to develop the CLI tool. It is recommended to keep both Node and NPM up-to-date with the latest releases.

- Node (version 16.x)
- NPM (version 8.5.x)

### Installation

Install the CLI globally with

```sh
npm install -g @cmsgov/hpt-validator-cli
```

### Usage

```sh
cms-hpt-validator --help
Usage: cms-hpt-validator [options] <filepath> <version>

Arguments:
  filepath                   filepath to validate
  version                    (choices: "v2.0", "v2.0.0")

Options:
  -V, --version              output the CLI version number
  -f, --format <string>      file format of file (choices: "csv", "json")
  -o, --output <string>      output format (choices: "table", "json", default: "table")
  -e, --error-limit <value>  maximum number for errors (default: 1000)
  -h, --help                 display help for command
```

### Examples

Basic usage:

```sh
cms-hpt-validator ./sample.csv v2.0.0
```

Overriding the default error limit to show 50 errors:

```sh
cms-hpt-validator ./sample.csv v2.0.0 -e 50
```

Overriding the default error limit to show all errors:

```sh
cms-hpt-validator ./sample.csv v2.0.0 -e 0
```

Using JSON output format:

```sh
cms-hpt-validator ./sample.csv v2.0.0 -o json
```

Using JSON output format with limited errors:

```sh
cms-hpt-validator ./sample.csv v2.0.0 -o json -e 10
```

### Output Formats

The CLI supports two output formats:

#### Table Format (default)

The default table format provides a human-readable output with colored text, showing validation results in a structured table format.

#### JSON Format

The JSON format provides machine-readable output that includes:

- File information (path, validator version, timestamp)
- Validation status (valid/invalid)
- Error and alert counts
- Detailed error and alert arrays

Example JSON output:

```json
{
  "file": "/path/to/sample.csv",
  "version": "1.10.0",
  "timestamp": "2025-01-11T17:00:00.000Z",
  "valid": false,
  "errorCount": 2,
  "alertCount": 1,
  "errors": [
    {
      "path": "C4",
      "field": "code | 1 | type",
      "message": "Invalid code type"
    }
  ],
  "alerts": [
    {
      "path": "D5",
      "field": "estimated_amount",
      "message": "Nine 9s used for estimated amount"
    }
  ]
}
```

### Machine-readable File Extensions

The two current allowable file formats for the HPT MRFs are CSV and JSON. The CLI will auto detect the file format passed into the tool for files that end with `.csv` or `.json` and will run the appropriate validator for that file. The CLI can also detect files compressed by gzip. Files ending with the `.gz` extension will be decompressed before validation. These file format detections can be combined, so files ending with `.csv.gz` or `.json.gz` will be decompressed and validated as CSV or JSON, respectively. For other files ending with `.gz`, use the `-f` option described above.

## Limitations

There may be a situation in which the CLI tool will run out of memory due to the amount of errors that are found in the file being validated. If you run into this NODE error, update the amount of errors to a smaller value that will be allowed to be collected with the `-e, --error-limit` flag.

## Contributing

Thank you for considering contributing to an Open Source project of the US
Government! For more information about our contribution guidelines, see
[CONTRIBUTING.md](CONTRIBUTING.md)

## Security

For more information about our Security, Vulnerability, and Responsible
Disclosure Policies, see [SECURITY.md](SECURITY.md).

## Authors and Maintainers

A full list of contributors can be found on [https://github.cms.gov/CMSGov/hpt-validator-cli/graphs/contributors](https://github.cms.gov/CMSGov/hpt-validator-cli/graphs/contributors).

## Public domain

This project is licensed within in the public domain within the United States,
and copyright and related rights in the work worldwide are waived through the
[CC0 1.0 Universal public domain
dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0 dedication. By
submitting a pull request or issue, you are agreeing to comply with this waiver
of copyright interest.
