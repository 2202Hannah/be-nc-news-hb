const db = require(`../db/connection`);

exports.deleteComment = comment_id => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id
    ])
    .then(({ rows }) => {
      if (rows.length === 1) {
        return rows;
      } else {
        return Promise.reject({
          status: 404,
          msg: "comment_id not found in the database"
        });
      }
    });
};
