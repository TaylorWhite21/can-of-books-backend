'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

// all of this came from jsonwebtoken docs and will be EXACTLY THE SAME
// ---------------------------

var client = jwksClient({
  // EXCEPTION!  jwksUri comes from your single page application -> settings -> advanced settings -> endpoint -> the jwks one
  jwksUri: 'https://dev-vb6a1x5t.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
//---------------------------------


app.get('/test', (req, res) => {
  // grab the token sent by the front end
  const token = req.headers.authorization.split(' ')[1];

  // the second part is from jet docs
  jwt.verify(token, getKey, {}, function (err, user){
    if(err){
      response.status(500).send('invlaid token');
    }
    res.send(user);
  });
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
