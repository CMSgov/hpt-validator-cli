# Hospital Price Transparency Validator CLI

CLI for validating CMS Hospital Price Transparency machine-readable files

## Getting Started

### Installation

Install the CLI globally with

```sh
npm install -g hpt-validator-cli
```

### Usage

```sh
cms-hpt-validator --help
Usage: cms-hpt-validator [options] <filepath>

Arguments:
  filepath               filepath to validate

Options:
  -f, --format <string>  file format of file (choices: "csv", "json")
  -h, --help             display help for command
```

### Example

```sh
cms-hpt-validator ./sample.csv
```

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
