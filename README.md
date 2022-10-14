# Northcoders News Backend Project

Link to hosted version: https://nc-news-hb.herokuapp.com/api

## Table of Contents

1. Summary of the project
2. How to use the project

## A Summary of the Project:

This project creates a server for a news website called Northcoders News. I completed this project as part of the software development training bootcamp at Northcoders.

I used the Node.js web application framework Express to create the server. I created multiple end points to make the server dynamic, such as GET, POST, PATCH and DELETE. Please see the enpoints.json file for a full list of all endpoints including a description of their functionality.

I used the MVC model to structure the project.

I wrote the application using full Test Driven Development (TDD). The tests for the application can be found in the **tests** folder. The tests also account for error handling and consider user error.

I am hosting the app on Heroku.

In the future I hope to implement a frontend user interface.

## How to setup and use the project:

### To clone the repository:

```bash dark
git clone https://github.com/2202Hannah/be-nc-news-hb
```

### Dependencies:

express version 4.18.2 minimum

```bash dark
npm install express
```

pg version 8.8.0 minimum

```bash dark
npm install pg
```

dotenv version 16.0.3 minimum

```bash dark
npm install dotenv --save
```

### To create the .env files for development and test:

File name: ".env.development"
content: PGDATABASE=nc_news

File name: ".env.test"
content: PGDATABASE=nc_news_test

### To seed the local database run:

```bash dark
npm run seed
```

### To run tests:

```bash dark
npm run test
```
