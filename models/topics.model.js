const db = require(`../db/connection`);

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = (slug, description) => {
  if ([slug, description].includes(undefined)) {
    return Promise.reject({ status: 400, msg: "You have made a bad request" });
  }

  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then(({ rows: [topic] }) => {
      return topic;
    });
};
