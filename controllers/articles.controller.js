const {
  selectArticleById,
  updateArticleVotes,
  selectArticles,
  selectCommentsByArticleId
} = require(`../models/articles.model`);

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchArticleVotesById = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes: votes } = request.body;

  updateArticleVotes(article_id, votes)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticles = (request, response, next) => {
  const topicFilter = request.query.topic;
  let orderQuery = request.query.order;
  let sortQuery = request.query.sort_by;

  selectArticles(topicFilter, orderQuery, sortQuery)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  selectCommentsByArticleId(article_id)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
};
