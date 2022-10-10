const express = require("express");
const app = express();
const { getTopics } = require(`./controllers/topics.controller.js`);
app.use(express.json());

app.get(`/api/topics`, getTopics);

//Error handling

app.all('/*', (request, response) => {
    response.status(404).send({ msg: 'Route not found' });
  });

app.use((err, request, response, next) => {
    response.status(500).send({ msg: "Something went wrong!" })
})

module.exports = app;
