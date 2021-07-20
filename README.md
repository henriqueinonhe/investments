# Investments Wallet App

A very simple investments wallet app.

## Table of Contents
- [1 Stack](#1-stack)
  * [1.1 API](#11-api)
  * [1.2 DB](#12-db)
  * [1.3 Frontend](#13-frontend)
- [2 Pre Requisites](#2-pre-requisites)
- [3 Installation](#3-installation)
  * [3.1 Rationale](#31-rationale)
- [4 Configuration](#4-configuration)
  * [4.1 Environment Variables](#41-environment-variables)
    + [4.1.1 API](#411-api)
    + [4.1.2 DB](#412-db)
    + [4.1.3 Frontend](#413-frontend)
  * [4.2 SSL/TLS Certificate](#42-ssltls-certificate)
  * [4.3 Migrations](#43-migrations)
- [5 Running](#5-running)
- [6 Testing](#6-testing)
- [7 Documentation](#7-documentation)
- [8 Troubleshooting](#8-troubleshooting)


## 1 Stack

### 1.1 API

- Runtime: [Node](https://nodejs.org/en/)
- Language: [Typescript](https://www.typescriptlang.org/)
- Framework: [Express](https://expressjs.com/)
- ORM: [TypeORM](https://typeorm.io/#/)
- Linter: [ESLint](https://eslint.org)
- Testing: [Jest](https://jestjs.io/)

### 1.2 DB

- Database: [MySQL](https://www.mysql.com/)

### 1.3 Frontend

- Language: [Typescript](https://www.typescriptlang.org/)
- Framework: [React](https://reactjs.org/)
- CSS in JS: [Styled Components](https://styled-components.com/)
- Bundler: [Webpack](https://webpack.js.org/)
- Linter: [ESLint](https://eslint.org)

## 2 Pre Requisites


- [Docker](https://www.docker.com/)
- [OpenSSL](https://www.openssl.org/) (optional, to enable HTTPS locally)
- [Node/NPM](https://nodejs.org/en/) (optional, but necessary for development)

## 3 Installation

Clone the project:

```sh
git clone https://github.com/henriqueinonhe/investments
```

As this projects uses Docker, most things will pretty much be set up automatically by `docker-compose`, but if you're going to setup a local development environment there's a few things that need to be done.

**TL;DR**

From inside the project's root directory, run:

```sh
cd api && npm ci
cd ..
cd frontend && npm ci
```
### Rationale

To make it possible for changes in code be reflected in the application without having to rebuild the containers images, both the `frontend` and `api` directories are bind mounted within their respective containers.

However, this also means that dependencies (`node_modules` in this case) are mounted as well, which is not a good thing given that usually your computer and the containers run different OSes/environments.

So to solve this issue, there's a normal volume that is mounted within the container that shadows `node_modules`, so the container still has access to the code located in your machine but also uses the depencies that the container itself has installed.

The downside is that each time you install a dependency you must do it twice, once inside the container (use `docker exec -ti <container-name> sh` to access it) and then once again in your machine (mostly to enable your code editor's Intellisense and make it stop complaining about missing dependencies).

## 4 Configuration



### 4.1 Environment Variables

You'll need to configure each service's environment variables.

To do so, create a `.env` file in each service folder (`api`, `db`, `frontend`).

For development purposes you may copy the content from `.env-sample` (present in each service folder) to the `.env` file, as it contains useful defaults that enables you to "just run it" using the provided `docker-compose.yaml`.

Nevertheless, should you need to tweak them, here's their documentation:

#### 4.1.1 API

- **PORT** - Port used by the server (if you're running the API inside a container don't forget that this refers to the port **inside** the container, not the one you're going to use to access the API).
- **USE_HTTPS** - Whether the server will run with https (in which case you'll need to generate the certificates)
- **MOCKED_USER** - The application uses [Auth0](https://auth0.com/) for authentication, however if you do not want to use it or can't use it for some reason (e.g. testing), set this variable to a dummy user name and then the API will bypass Auth0 completely.
- **TYPEORM_CONNECTION** - MUST BE SET TO `"mysql"`.
- **TYPEORM_HOST** -  Database URI.
- **TYPEORM_USERNAME** -  Username used to access DB.
- **TYPEORM_PASSWORD** -  Password used to access DB.
- **TYPEORM_DATABASE** -  Self explanatory.
- **TYPEORM_PORT** -  Database port.
- **TYPEORM_SYNCHRONIZE** -  MUST BE SET TO `"false"`
- **TYPEORM_LOGGING** -  Whether queries issued to the DB will be logged on the console.
- **TYPEORM_ENTITIES** -  MUST BE SET TO `"dist/entities/**/*.js"`
- **TYPEORM_MIGRATIONS** -  MUST BE SET TO `"dist/migrations/**/*.js"`
- **TYPEORM_MIGRATIONS_DIR** -  MUST BE SET TO `"src/migrations"`
- **TYPEORM_MIGRATIONS_TABLE_NAME** -  MUST BE SET TO `"Migrations"`
- **AUTH0_JWKS_URI** - Auth0 related config. See [more](https://auth0.com/docs/quickstart/backend/nodejs).
- **AUTH0_AUDIENCE** - Auth0 related config. See [more](https://auth0.com/docs/quickstart/backend/nodejs).
- **AUTH0_ISSUER** - Auth0 related config. See [more](https://auth0.com/docs/quickstart/backend/nodejs).

#### 4.1.2 DB

- **MYSQL_USER** - DB user.
- **MYSQL_PASSWORD** - DB password.
- **MYSQL_ROOT_PASSWORD** - DB root user password.
- **MYSQL_DATABASE** Self explanatory.

#### 4.1.3 Frontend

- **PORT** - Port used by the development server (if you're running the Frontend inside a container don't forget that this refers to the port **inside** the container, not the one you're going to use to access the Frontend).
- **USE_HTTPS** - Whether the development server will use HTTPS (Webpack generates certificates by itself).
- **SOCK_PORT** - Live reloading relies on a Websockets connection, but the port it operates on defaults to the port used by the development server, however as you'll be acessing the page from outside the container (usually via a different port than the one the application uses from within the container) you need to set this to the port the container is mapped to in your machine.
- **API_BASE_URL** - The address where the API is located.
- **USE_AUTH0** - Whether to use [Auth0](https://auth0.com/). If this is set to `false`, all calls to Auth0 will be mocked.
- **AUTH0_DOMAIN** - Auth0 related config. See [more](https://auth0.com/docs/quickstart/spa/react).
- **AUTH0_CLIENT_ID** -  Auth0 related config. See [more](https://auth0.com/docs/quickstart/spa/react).
- **AUTH0_AUDIENCE** - Auth0 related config. See [more](https://auth0.com/docs/quickstart/spa/react).

### 4.2 SSL/TLS Certificate

To serve the API using HTTPS instead of plain HTTP, you'll need to generate a self signed certificate, which is very simple using OpenSSL:

From inside `api` directory, run:

```sh
mkdir certs && cd certs
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

You will be prompted to answer a some questions, but you can just leave them blank/use the provided defaults if you wish.

And *voila*, you're all set.

P.S. As the certificate is self-signed, you'll probably need to access the API via browser first (`/` path leads to the API documentation), before consuming it via the frontend.

### 4.3 Migrations

**After** running the application the first thing you'll need to do is to run the migrations to setup the DB tables.

The easiest way to do this, is to run the migrations from inside the API container:

```sh
docker exec -ti InvestmentsAPI sh

#Now inside the container
npx typeorm migration:run
```

And then restart the API container so that it picks up generated entity metadata.

```sh
docker restart InvestmentsAPI
```

You may also run them from outside the container, you just need to compile the code and tweak `DB_HOST` so that it points to the DB from outside the container:

```sh
#Compile
npx tsc -p .

#Run migrations
npx typeorm migration:run
```

## 5 Running

If you used the configurations present in `.env-sample` for each service, you should be able run the application with:

```sh
docker-compose up
```

This will build the images, create an isolated network for the services, set up volumes and spin up the containers.

Containers default names and ports are:

- API - InvestmentsAPI - 3001
- DB - InvestmentsDB - 3306
- Frontend - InvestmentsFrontend - 3000

Make sure these ports are available, or change them to the ones you want in `docker-compose.yaml` and don't forget to also change environment variables accordingly.

To access a container via command line (useful for installing/removing dependencies, running migrations, debugging):

```sh
docker exec -ti <container-name> sh
```

**DON'T FORGET TO RUN [MIGRATIONS](#migrations)!**

## 6 Testing

There are currently a few API integration tests using Jest.

In order to run them you need to access the API container and then run jest:

```sh
docker exec -ti InvestmentsAPI
npx jest
```
## 7 Documentation 

API is documented using Swagger UI and is accessible at the root path `/`.

## 8 Troubleshooting

### Required tables doesn't exist
```
QueryFailedError: Table '<DB_NAME>.Investments doesn't exist
```

Did you run the [migrations](#43-migrations)?

### Invalid SSL Certificate when calling API from browser

Caused by using a self signed certificate, you just need to tell your browser to accept it.

Go to `<API_BASE_URL>` via browser and accept the security prompt.

Or run everything through HTTP by setting environment variable `USE_HTTPS` to false both in frontend and api.
### Problems with missing entity metadata in API

After running migrations you must restart the API container:

```sh
docker restart InvestmentsAPI
```

