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

exports.selectArticles = (
  topicFilter,
  sortQuery = "desc",
  orderQuery = "created_at"
) => {
  sortQuery = sortQuery.toUpperCase();

  if (
    ["ASC", "DESC"].includes(sortQuery) &&
    [
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes"
    ].includes(orderQuery)
  ) {
    let queryString = `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
    const valueArray = [];

    if (topicFilter) {
      queryString += ` WHERE topic = $1`;
      valueArray.push(topicFilter);
    }

    queryString += ` GROUP BY articles.article_id ORDER BY ${orderQuery} ${sortQuery};`;

    return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
      const topicsArray = rows.map(topic => {
        return Object.values(topic).toString();
      });

      return db.query(queryString, valueArray).then(({ rows }) => {
        if (rows.length === 0 && !topicsArray.includes(topicFilter)) {
          return Promise.reject({
            status: 404,
            msg: "You have made a bad request - this topic does not exist"
          });
        } else {
          return rows;
        }
      });
    });
  } else {
    return Promise.reject({ status: 400, msg: "You have made a bad request" });
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

exports.insertComments = (article_id, username, body) => {
  
  if(body === undefined || username === undefined ) {
    return Promise.reject({status: 400, msg: "You have made a bad request"})
  }

  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body, username, article_id]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.insertArticle = (author, title, body, topic) => {
  
  if(body === undefined || title === undefined || author === undefined || topic === undefined) {
    return Promise.reject({status: 400, msg: "You have made a bad request"})
  }

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *`,
      [author, title, body, topic]
    )
    .then(({ rows: [article] }) => {
      const newArticleId = article.article_id;
      return db.query(`SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = ${newArticleId}
      GROUP BY articles.article_id `).then(({rows: [article]}) => {
        return article;
      })
    });

}