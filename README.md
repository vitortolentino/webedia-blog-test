# Webedia Job Test

A blog API using industry best practices to deliver great results

## Table of Contents

- [Installation](#installation)
- [Configure Sentry](#configure-sentry-errors-management)
- [Usage](#usage)
- [Database](#database)
- [Tests](#tests)

## Installation

Clone the repository and create a .env file in root directory

```sh
$ git clone https://github.com/Antimaterium/webedia-blog-test.git
$ cd webedia-blog-test
$ cp .env.example .env
```
Then run

```$ npm install``` 

or

```$ yarn install```


## Configure Sentry (errors management)

Go into [sentry.io](https://sentry.io/auth/login/) and create a new express project

Copy the DSN and paste it into SENTRY_DSN inside the .env file.

## Usage

Run project in development mode

```$ npm run dev```

or

```$ yarn dev```

## Database

You can use the dump (webedia.sql) in the root or run the migrations like bellow

run migrations with

```$ node_modules/.bin/sequelize db:migrate``` 

or 

``` $ yarn sequelize db:migrate```

**Note:** Make sure your postgres database is up

## Tests

Run tests

```$ npm run test``` 

or 

```$ yarn test```

If you have any questions, please feel free to contact me at vitorafonso33@gmail.com or by opening a pull request.
