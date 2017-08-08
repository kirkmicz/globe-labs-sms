'use strict'

module.exports = function(app) {
  var api = require('../controllers/api');
  app.route('/send')
    .post(api.send)

  app.route('/receive')
    .post(api.receive)
}
