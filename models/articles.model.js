const db = require(`../db/connection`);

exports.selectArticleById = articleId => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows: article }) => {
      if (article.length === 1) {
        return article[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "article_id not found in the database"
        });
      }
    });
};

exports.updateArticleVotes = (article_id, votes) => {
  if (votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "This is a bad request - no data provided for patch request"
    });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [votes, article_id]
    )
    .then(({ rows: article }) => {
      if (article.length === 1) {
        return article[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "article_id not found in the database"
        });
      }
    });
};
