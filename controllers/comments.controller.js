const { deleteComment } = require(`../models/comments.model`);

exports.removeComment = (request, response, next) => {
  const { comment_id } = request.params;

  deleteComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
