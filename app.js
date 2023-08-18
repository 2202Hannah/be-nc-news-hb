const express = require("express");
const app = express();
const { getAllEndPoints } = require(`./controllers/contents.controller`);
const { getTopics, postTopic } = require(`./controllers/topics.controller.js`);
const {
  getArticleById,
  patchArticleVotesById,
  getArticles,
  getCommentsByArticleId,
  postCommentsByArticleId,
  postArticle,
  removeArticle
} = require(`./controllers/articles.controller`);
const {
  getUsers,
  getUserByUsername
} = require(`./controllers/users.controller`);
const {
  removeComment,
  patchCommentVotes
} = require(`./controllers/comments.controller`);

app.use(express.json());

app.get(`/api`, getAllEndPoints);
app.get(`/api/topics`, getTopics);
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id`, getArticleById);
app.get(`/api/users`, getUsers);
app.get(`/api/articles/:article_id/comments`, getCommentsByArticleId);
app.get(`/api/users/:username`, getUserByUsername);

app.patch(`/api/articles/:article_id`, patchArticleVotesById);
app.patch(`/api/comments/:comment_id`, patchCommentVotes);

app.post(`/api/articles/:article_id/comments`, postCommentsByArticleId);
app.post(`/api/articles`, postArticle);
app.post(`/api/topics`, postTopic);

app.delete(`/api/comments/:comment_id`, removeComment);
app.delete(`/api/articles/:article_id`, removeArticle)

//Error handling

app.all("/*", (request, response) => {
  response.status(404).send({ msg: "Route not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response
      .status(400)
      .send({ msg: "You have made a bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "23503") {
    response.status(404).send({ msg: "Value not found in the database" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "42703") {
    response
      .status(400)
      .send({ msg: "You have made a bad request" });
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
