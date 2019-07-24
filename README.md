# Webedia Job Test

A blog API using industry best practices to deliver great results

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configure Sentry](#sentry)
- [Migrations](#migrations)
- [Tests](#tests)

## Installation

Clone the repository and create a .env file in root directory

```sh
git clone https://github.com/Antimaterium/webedia-blog-test.git
cd webedia-blog-test
touch .env
```
Then run
```npm install``` or ```yarn install```

Copy the contents of .env.example to .env and fill in the empty fields

## Configure Sentry (errors management)

Go into [sentry.io](https://sentry.io/auth/login/) and create a new express project

Copy the DSN and paste it into SENTRY_DSN inside the .env file.

## Migrations

run migrations with

```node_modules/.bin/sequelize db:migrate``` or ```yarn sequelize db:migrate```

**Note:** Make sure your postgres database is up

## Usage

Run project in development mode

```npm run dev```  or ```yarn dev```

## Tests

Run tests

```npm run test``` or ```yarn test```

If you have any questions, please feel free to contact me at vitorafonso33@gmail.com or by opening a pull request.
