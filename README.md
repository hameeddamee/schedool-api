## About Schedool

Schedool is a todo app that allows you to not just schedule your to-dos but also set the priority levels
The **DEMO** version of the app is hosted [here](https://schedool.herokuapp.com/)

## About The Codebase

This codebase is the **REST API** for the [Schedool app](https://schedool.herokuapp.com/). The staging version of the API is hosted [here](https://schedool-api.herokuapp.com/).

## Technology Used

- NodeJS
- MongoDB
- Express

## Setup

To setup the app,

1. Clone the app to your local machine and run `npm install`
2. Provide local credentials for running the app the `config/dev.js`. To see a detailed list of all setup in `.env`, click [Providing ENV](#providing-env)
3. Then run `npm start`

## Folder Structure

```
Schedool-api/
  .github
  node_modules/
  src/
    components
      user
        user.controller.js
        user.error.js
        user.model.js
        user.routes.js
        user.service.js
        user.validator.js
      todo
        todo.controller.js
        todo.error.js
        todo.model.js
        todo.routes.js
        todo.service.js
        todo.validator.js
    config
      ci.js
      dev.js
      index.js
      prod.js
    library
      helpers
      middlewares
    app.js
    server.js
  .gitignore
  .travis.yml
  package.json
  README.md
```

The core of the app can be found in the `src` folder has illustrated above. Though the app does not implement microservice architecture at the moment, we have structured the app to make it easier to enable microservices in the future. To achieve this, we have broken down the contents in the `components` folder into modules. At the moment, there's just two modules which are the **users** module and the **todo** module. In the near future, I will be splitting the modules into microservices. The architectural approach is shown below:
![structure](https://github.com/hameeddamee/schedool-api/blob/master/structure.png)

## Providing ENV

If you are deploying to production, you would need provide the following ENV variable on your server

```
PORT=4000
JWT_SECRET='yoursecret'
LOG_LEVEL='silly'
JWT_TOKEN_TYPE='Bearer'
API_PREFIX='/api/v1'
APP_NAME='schedool'
CLIENT_BASE_URL=''
MONGODB_URI='mongostring'
```

## How to contribute

You can start contributing to the codebase once you're done with your local setup.

## Rest API Documentation

Once you're done setting up, you can read about the `endpoints` on postman.
At the moment the API documentation is hosted on Postman:<br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/11294995/TVYM3aac)

However, you can also use other platforms. If you check the `users.routes.js`, you will notice that the routes are written with the JSDoc convention in mind which should make it easier for you to use the JSDoc system to document your code and APIs.
