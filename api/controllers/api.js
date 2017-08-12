'use strict'

const
  request = require('request'),
  _ = require('lodash')

const
  fs = require('fs'),
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const stellarApi = config.url

exports.main = (req, res) => {
  res.json({ message: 'Back Off' })
}


/**
  URL params
  - code
*/
exports.subscribe = (req, res) => {
  const obj = {
    app_id: config.credentials.id,
    app_secret: config.credentials.secret,
    code: req.query.code
  }

  request.post({
    url: config.tokenURI,
    form: obj
  }, (error, response, body) => {
    if(error || response.statusCode != 200) {
      res.status(response.statusCode).send({ error: 'An error occurred! Please contact Administrator.' })
    } else {
      tokenToApp(JSON.parse(response.body)).then( (data) => {
        res.json(data)
      }).catch( (e) => {
        res.status(500).send({ error: 'An error occurred! Please contact Administrator.' })
      })
    }
  })
}

const tokenToApp = (obj) => {
  return new Promise( (response, reject) => {
    obj = {
      token: obj.access_token,
      mobile: obj.subscriber_number
    }
    request.post({
      url: config.counter_app.tokenURI,
      form: obj
    }, (error, resp, body) => {
      if(error || resp.statusCode != 200) {
        reject({ error: 'An error occurred! Please contact Administrator.' })
      } else {
        response(JSON.parse(resp.body))
      }
    })
  })
}

/**
  URL params
  - access_token

  BODY params
  - to
  - from (sender's last 4 digit)
  - message
*/
exports.send = (req, res) => {
  const access_token = req.query.access_token
  const r = req.body,
    receiver = r.from,
    sender = r.to,
    message = r.message

  const obj = {
    outboundSMSMessageRequest: {
      address: sender,
      senderAddress: receiver,
      outboundSMSTextMessage: {
        message: message
      }
    }
  }

  request.post({
    url: config.sendURI + config.shortCode + "/requests?access_token=" + access_token,
    form: obj
  }, (error, response, body) => {
    if(error || response.statusCode != 200) {
      const errMsg = (response.body != null ? JSON.parse(response.body)
        : { error: 'An error occurred! Please contact Administrator.' })
      res.status(response.statusCode).send(errMsg)
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
exports.receive = (req, res) => {
  const received = req.body.inboundSMSMessageList.inboundSMSMessage[0]

  const obj = {
    message: received.message,
    sender: received.senderAddress
  }

  request.post({
    url: config.receivedURI,
    form: obj
  }, (error, response, body) => {
    if(error || response.statusCode != 200) {
      res.status(response.statusCode).send({ error: 'An error occurred! Please contact Administrator.' })
    } else {
      res.json({ success: true })
    }
  })
}
