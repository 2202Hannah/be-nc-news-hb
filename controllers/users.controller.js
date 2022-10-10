const { selectUsers } = require(`../models/users.model`);

exports.getUsers = (request, response) => {
  selectUsers()
    .then(users => {
      response.status(200).send({ users });
    })
    .catch(err => {
      next(err);
    });
};
