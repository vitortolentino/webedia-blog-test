# Webedia Job Test

A blog API using industry best practices to deliver great results

## Table of Contents

- [Installation](#installation)
- [Configure Sentry](#configure-sentry-errors-management)
- [Usage](#usage)
- [Database](#database)
- [Tests](#tests)
- [How to use](#how-to-use)

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

## How to use

**Create Session (JWT Token)**

    POST localhost:3000/session
    
Create a JWT Token. Returns the author object and the token.

## Parameters
### Body Parameters
Field | Required 
--- | --- 
email | Y |
password | Y | 

## Example
### Request

    POST localhost:3000/session
#### Request Body
```json 
{
	"email": "vitorafonso33@gmail.com",
	"password": "123456"
}
```

### Return
``` json
{
    "author": {
        "id": 2,
        "name": "vitor",
        "email": "vitorafonso33@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTY0NDA1ODM0LCJleHAiOjE1NjQ0MDk0MzR9.SyJLmOZJ1iQPb8kX9EsZsmkTA5Zqu1F8TvU_4IfgG_A"
}
```

**List Authors**

    GET localhost:3000/author
    
Returns a list of Authors


## Parameters
page - Select current page for listing

limit - Set limit of Authors by page

## Example
### Request

    GET localhost:3000/author?page=1&limit=20

### Response
``` json
[
    {
        "id": 1,
        "name": "vitor",
        "email": "vitorafonso133@gmail.com"
    },
    {
        "id": 4,
        "name": "Kailyn Hickle II",
        "email": "Donna_Auer39@gmail.com"
    },
    {
        "id": 8,
        "name": "Micah Mills",
        "email": "Zoie_Will83@hotmail.com"
    }
]
```


**Create Author**

    POST localhost:3000/author
    
Create a Author. Returns the newly-created object.

## Parameters
### Body Parameters
Field | Required 
--- | --- 
name | Y |
email | Y |
password | Y | 

## Example
### Request

    POST localhost:3000/author
#### Request Body
```json 
{
	"name": "vitor",
	"email": "vitorafonso33@gmail.com",
	"password": "123456"
}
```

### Return
``` json
{
    "id": 1,
    "name": "vitor",
    "email": "vitorafonso33@gmail.com"
}
```

**Update Author**

    PUT localhost:3000/author
    
Update a Author. Returns the updated object.

## Parameters
### URI Parameters
Field | Required 
--- | --- 
author_id | Y |

### Body Parameters
Field | Required 
--- | --- 
name | Y |
email | Y |

## Example
### Request

    PUT localhost:3000/author/:author_id
#### Request Body
```json 
{
	"name": "Other name",
	"email": "other@email.com"
}
```

### Return
``` json
{
    "email": "other@email.com",
    "name": "Other name",
    "id": "1"
}
```

**Update Author**

    DELETE localhost:3000/author/:author_id
    
Delete a Author.

### URI Parameters
Field | Required 
--- | --- 
author_id | Y |

## Example
### Request

    DELETE localhost:3000/author/1

### Response
Does not respond nothing, only status 200

If you have any questions, please feel free to contact me at vitorafonso33@gmail.com or by opening a pull request.
