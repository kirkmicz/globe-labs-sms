##Send and Received with Globe Labs

###Install dependencies needed

```
npm install
```

###Send an SMS

**PROTOCOL:** POST

**URL** `/send?access_token={access_token here}`

```
{
  "to": "09173055046",
  "from": "4152",
  "message": "Sample Message"
}
```

**SAMPLE RESPONSE**

```
{
  "outboundSMSMessageRequest": {
    "address": "09173055046",
    "deliveryInfoList": {
      "deliveryInfo": [],
      "resourceURL": "https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/8011/requests?access_token=3YM8xurK_IPdhvX4OUWXQljcHTIPgQDdTESLXDIes4g"
    },
    "senderAddress": "8011",
    "outboundSMSTextMessage": {
      "message": "Hello World"
    },
    "receiptRequest": {
      "notifyURL": "http://test-sms1.herokuapp.com/callback",
      "callbackData": null,
      "senderName": null,
      "resourceURL": "https://devapi.globelabs.com.ph/smsmessaging/v1/outbound/8011/requests?access_token=3YM8xurK_IPdhvX4OUWXQljcHTIPgQDdTESLXDIes4g"
    }
  }
}
```


###Receive SMS

Set your own endpoint in `config.json`

```
"receivedURI": "{ endpoint of receiving }",
```

From your endpoint newly arrived SMS data shows like this


```
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
```
