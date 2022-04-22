<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

This is a basic project with [Nest](https://github.com/nestjs/nest) framework, along with neat source code organization and many pre-configured features and techniques.

## Features and Techniques

- Authentication (passport JWT)
- Authorization (ACL)
- Security
- Emailing Queue (bull)
- API Document (swagger)
- File uploads. Support local and Amazon S3 drivers
- Server static
- Schedule with cronjobs
- Check health
- Caching (redis)
- Cache manager (redis-commander)
- Logging (winston)
- CRUD
- Pagination (nestjs-paginate)
- Request Validation
- Config Service
- TypeORM
- Migration and seeding
- E2E and units tests
- CI/CD

## Getting Started

To start developing the project please check if you have these tools installed on your machine:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Docker](https://www.docker.com/get-started)

### Installation

1. Clone the repo

```sh
git clone https://github.com/yantee98/nestjs-base
```

2. Move into microservice-template

```sh
cd nestjs-base
```

3. Install project dependencies

```sh
yarn
```

4. Copy .env.example file as .env and fill it with your environment variables

```sh
cp .env.example .env
```

5. Running with docker

- Start development environment:

```sh
docker-compose -f docker-compose.dev.yml up -d

# or run script
# sh run.sh up-dev
```

- Start development environment with debugger on vscode:

```sh
docker-compose -f docker-compose.debug.yml up -d

# or run script
# sh run.sh up-debug
```

> - **You can access to API by URL: http://localhost:3001/api in browser**
> - **You can access to redis commander by URL: http://localhost:8081 in browser**

6. Stopping

```sh
docker-compose -f docker-compose.dev.yml up -d # dev env

docker-compose -f docker-compose.debug.yml up -d # debug env

# or run script
# sh run.sh down-dev || sh run.sh down-debug
```

## Todos

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## License

This project is available under the [MIT licensed](LICENSE). See `LICENSE` for more information.
