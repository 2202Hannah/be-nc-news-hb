const express = require("express");
const app = express();
const { getTopics } = require(`./controllers/topics.controller.js`);
const {
  getArticleById,
  patchArticleVotesById,
  getArticles,
  getCommentsByArticleId
} = require(`./controllers/articles.controller`);
const { getUsers } = require(`./controllers/users.controller`);

app.use(express.json());

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/users`, getUsers);
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id/comments`, getCommentsByArticleId);

app.patch(`/api/articles/:article_id`, patchArticleVotesById);

//Error handling

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Route not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response
      .status(400)
      .send({ msg: "You have made a bad request - invalid type" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response.status(500).send({ msg: "Something went wrong!" });
});

module.exports = app;
