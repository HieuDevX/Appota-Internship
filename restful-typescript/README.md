<h1>Building RESTful Web APIs with Node.js, Express, MongoDB and TypeScript</h1>

source: [Link](https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-1-2-195bdaf129cf)

1. Use Typescript, use tsc to compile (tsconfig.json)
2. Linter: TSLint (tslint.json)
3. MVC api structure
  * models: just define mongoose Schema
  * Controller: define clear method handle each request, query database in there
  * routes: use controller.method()
4. Use OOP of typescript for express App()