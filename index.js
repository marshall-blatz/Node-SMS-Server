require('dotenv').config() 
TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
USER_PHONE_NUMBER = process.env.USER_PHONE_NUMBER

//create express server
const express = require("express")
const app = express()

//connects to mqtt client
var mqtt = require("mqtt")
const mqtt_client = mqtt.connect("mqtt://test.mosquitto.org");

//connects to twilio client
const twilio_client = require('twilio')(
TWILIO_ACCOUNT_SID,
TWILIO_AUTH_TOKEN
);

//subscribes to mqtt topic
mqtt_topic = 'protocol_receiver_arduino_lab2'
mqtt_client.on('connect', function () {
    mqtt_client.subscribe(mqtt_topic, function (err) {
        console.log(`subscribed to ${mqtt_topic}`)
    })
})

mqtt_client.on('message', function (topic, message) {
if(message.toString() == '30836'){ // 30836 is code for a tripped sensor in this system
    console.log(mqtt_response)
    sendText()
}
})

function sendText(){
    var alert = "Critical Safety Event at " + getDateAndTime()
    twilio_client.messages
    .create({
      from: TWILIO_PHONE_NUMBER,
      to: USER_PHONE_NUMBER,
      body: alert
    })
    .then(() => {
      console.log("sms successfully sent")
    })
    .catch(err => {
      console.log("error with sms: " + err)
    });
};

function getDateAndTime(){
    let currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() 
    var year = currentDate.getFullYear()
    var hours = currentDate.getHours()
    var minutes = currentDate.getMinutes()
    var ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    month = month < 10 ? '0'+month : month + 1;
    day = day < 10 ? '0'+day : day;
    var date_and_time = hours + ':' + minutes + ' ' + ampm + ' on ' + month + "/" + day + "/" + year;
    return date_and_time
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () =>  console.log(`server running on port ${PORT}`))