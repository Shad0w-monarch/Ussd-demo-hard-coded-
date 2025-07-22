require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const Africastalking = require('africastalking');

//!!Rerun with new changes 
//require('dotenv').config(); // Load environment variables
//const express = require('express');
//const bodyParser = require('body-parser');
//const Africastalking = require('africastalking');

// Debug: confirm env variables
console.log('AT_USERNAME:', process.env.AT_USERNAME);
console.log('AT_API_KEY  :', process.env.AT_API_KEY ? '●●●●●' : '(missing)');

// Initialize Africa's Talking SDK
const at = Africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const ussd = at.USSD;

const app = express();
app.use(urlencoded({ extended: false }));

// 1) Redirect any POST / to POST /ussd (in case the provider omits the path)
app.post('/', (req, res, next) => {
  req.url = '/ussd';
  next();
});

// 2) USSD handler
app.post('/ussd', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = '';

  // Main menu
  if (text === '') {
    response  = 'CON 🚀 Welcome to Prim_JS_DEMO_USSD\n';
    response += '1. Check Balance\n';
    response += '2. Buy Airtime\n';
    response += '3. Exit';
  }
  // Balance option
  else if (text === '1') {
    response = 'END Your balance is 100 units.';
  }
  // Airtime flow: prompt for amount
  else if (text === '2') {
    response = 'CON Enter amount:';
  }
  // Airtime confirmation
  else if (/^2\*\d+$/.test(text)) {
    const amt = text.split('*')[1];
    response = `END You will be charged ${amt} units.`;
  }
  // Exit or any other input
  else {
    response = 'END Thank you for using PrimeUSSD.';
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚦 Server listening on port ${port}`));
