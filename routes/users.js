const controller = require('../controller/users');

const middleware = require('../middleware/Auth');

const authorization = require('../middleware/admin');

const { adminRoute } = authorization;

const { validateToken } = middleware;


module.exports = (router) => {
  router.route('/auth/create-user')
    .post(validateToken, adminRoute, controller.createUser);

  router.route('/auth/signin')
    .post(controller.login);

  router.route('/user')
    .get(validateToken, controller.getLoggedInUser);

  router.route('/feed')
    .get(controller.getFeed);
};
