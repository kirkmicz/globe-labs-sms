'use strict'

const
  request = require('request'),
  _ = require('lodash')

const
  fs = require('fs'),
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const stellarApi = config.url

/**
  URL params
  - access_token

  BODY params
  - to
  - from (sender's last 4 digit)
  - message
*/
exports.send = function(req, res) {
  const access_token = req.query.access_token
  const r = req.body,
    receiver = r.to,
    sender = r.from,
    message = r.message

  const obj = {
    outboundSMSMessageRequest: {
      address: receiver,
      senderAddress: sender,
      outboundSMSTextMessage: {
        message: message
      }
    }
  }
console.log(config.sendURI + config.shortCode + "/requests?access_token=" + access_token)
  request.post({
    url: config.sendURI + config.shortCode + "/requests?access_token=" + access_token,
    form: obj
  }, function(error, response, body) {
    console.log(response.statusCode)
    if(error || response.statusCode != 200) {
      console.log(response.body)
      res.status(response.statusCode).send({ error: 'An error occurred! Please contact Administrator.' })
    } else {
      res.json(JSON.parse(response.body))
    }
  })
}

/**
  -- Note this function only receives an data

  -- Expected Request
  {
    "inboundSMSMessageList":{
      "inboundSMSMessage":[
        {
          "dateTime":"Fri Nov 22 2013 12:12:13 GMT+0000 (UTC)",
          "destinationAddress":"tel:21581234",
          "messageId":null,
          "message":"Hello",
          "resourceURL":null,
          "senderAddress":"tel:+639171234567"
        }
      ],
      "numberOfMessagesInThisBatch":1,
      "resourceURL":null,
      "totalNumberOfPendingMessages":null
    }
  }
*/
exports.receive = function(req, res) {
  request.post({
    url: config.receivedURI,
    form: req.body
  }, function(error, response, body) {
    if(error || response.statusCode != 200) {
      res.status(response.statusCode).send({ error: 'An error occurred! Please contact Administrator.' })
    } else {
      res.json({ success: true })
    }
  })
}
