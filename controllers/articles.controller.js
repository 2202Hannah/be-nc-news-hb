const {
  selectArticleById,
  updateArticleVotes,
  selectArticles,
  selectCommentsByArticleId,
  insertComments
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
  selectArticles(topicFilter)
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

exports.postCommentsByArticleId = (request, response, next) => {
  const article_id = parseInt(request.params.article_id);
  const { username, body } = request.body;

  insertComments(article_id, username, body)
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

// const promises = [insertComments(article_id, username, body)];

// if (article_id) {
//   promises.push(selectArticleById(article_id));
// }

// console.log(promises);

// Promise.all(promises)
