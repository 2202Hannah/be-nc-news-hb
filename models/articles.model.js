const db = require(`../db/connection`);

exports.selectArticleById = article_id => {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) ::INT AS comment_count
      FROM articles
          LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 1) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "article_id not found in the database"
        });
      }
    });
};

exports.updateArticleVotes = (article_id, votes = 0) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 1) {
        return rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "article_id not found in the database"
        });
      }
    });
};

exports.selectArticles = topicFilter => {
  if (topicFilter) {
    return db
      .query(
        `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) ::INT AS comment_count
      FROM articles
          LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE topic = $1
      GROUP BY articles.article_id
      ORDER BY articles.created_at`,
        [topicFilter]
      )
      .then(({ rows }) => {
        return rows;
      });
  } else {
    return db
      .query(
        `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) ::INT AS comment_count
    FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at`
      )
      .then(({ rows }) => {
        return rows;
      });
  }
};

exports.selectCommentsByArticleId = article_id => {
  return db.query(`SELECT article_id FROM articles`).then(({ rows }) => {
    const idArray = rows.map(id => {
      return Object.values(id).toString();
    });
    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0 && !idArray.includes(article_id)) {
          return Promise.reject({
            status: 404,
            msg: "article_id not found in the database"
          });
        } else {
          return rows;
        }
      });
  });
};
