'use strict'

module.exports = function(app) {
  var api = require('../controllers/api');

  app.route('/')
    .get(api.main)

  app.route('/send')
    .post(api.send)

  app.route('/receive')
    .post(api.receive)

  app.route('/subscribe')
    .get(api.subscribe)
}
