# nest pocketbase boilerplate

<div align="center">
  <img src="assets/logo.jpg" width="300" height="300">
</div>

## Features

- Docker
- Docker-compose
- Nginx
- Certbot
- Pocketbase
- NestJs
- Guards
- Login
- New Typescript Pocketbase ORM (https://www.npmjs.com/package/typescript-pocketbase-orm)

## Usage

First, copy the `.env.sample` file to `.env` and change the values.

### With docker

```bash
$ docker-compose up -d
```

### With docker and nginx

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up -d
```

- You can access the application at `http://localhost:3000`
- You can access the swagger at `http://localhost:3000/api` (only for dev)
- You can access to pocketbase at `http://localhost:8090`

### Locally

You need a pocketbase instance running

```bash
$ yarn install
$ yarn run start:dev
```

## Author

- Joss C - https://github.com/nexus9111