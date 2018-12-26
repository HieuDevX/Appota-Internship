<h1>Building RESTful Web APIs with Node.js, Express, MongoDB and TypeScript based on Mr. VietTD's template project</h1>

1. Use Typescript, use tsc (ts-node) to compile (tsconfig.json)
2. Linter: TSLint (tslint.json)
3. Project structure
  * models: just define mongoose Schema
  * Controller: define clear method handle each request, query database in there
  * routes: use controller.method()
  * custom: folder store a lot of folders such as: caches, commands, configs, events, exceptions, helpers, jobs, middlewares, services
4. Validator: JOI

<h1>Run</h1>

1. Prerequisite: Docker, [how to install Docker Community Edition](https://docs.docker.com/install/)
2. Command
* Development: 

        docker-compose -f docker-compose.dev.yml up -d

* Production: 

        yarn build or npm run build
        docker-compose up -d