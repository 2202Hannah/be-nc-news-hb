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
