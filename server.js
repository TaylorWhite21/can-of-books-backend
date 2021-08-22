'use strict';


const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const BookModel = require('./models/books.js')
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();



// all of this came from jsonwebtoken docs and will be EXACTLY THE SAME
// ---------------------------

var client = jwksClient({
  // EXCEPTION!  jwksUri comes from your single page application -> settings -> advanced settings -> endpoint -> the jwks one
  jwksUri: 'https://dev-vb6a1x5t.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
//---------------------------------

app.get('/clear', clear);

// app.get('/seed', seed);

app.get('/books', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // the second part is from jet docs
    jwt.verify(token, getKey, {}, function (err, user) {
      if (err) {
        console.log('error')
        res.status(500).send('invlaid token');
      } else {
        let email = req.query.email
        console.log(email)
        BookModel.find((err, dbResult) => {
          //           ^{email},
          if (err) {
            res.send('Unable to access BD');
          } else {
            res.status(200).send(dbResult);
          }

        });
      };
    });
  }
  catch (err) {
    res.status(500).send('dbase error')
  }

});


app.post('/books', (req,res) => {
  try {
    console.log(req.body)
    let { title, description, status, email} = req.body

    let newBook = new BookModel({title, description, status, email})
    newBook.save();
    res.send(req.body)
  } catch {
    res.send('Post Failed')
  }
})

mongoose.connect('mongodb://127.0.0.1:27017/books', {
  useNewUrLParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to the Database');

    let books = await BookModel.find({});
    if (books.length === 0) {
      await addBook({
        title: 'Halo: Glasslands',
        description: 'Set after the end of the Human-Covenant War in 2553, Halo: Glasslands explores the volatile political situation in the Halo universe following the end of the war.[3] The novel picks up directly where Halo: Ghosts of Onyx left off, with Dr. Halsey, Chief Mendez along with a group of SPARTAN-IIs and SPARTAN-IIIs stranded on a Forerunner shield world locked in a slipspace bubble in the remnants of the artificial planet Onyx. Meanwhile, Office of Naval Intelligence Director Admiral Margaret Parangosky assembles a black ops team known as Kilo-Five, which is assigned on a covert mission to sow discord between disparate Sangheili factions by any means necessary, as well as to arrest Dr. Halsey once she has been located.',
        status: 'FAVE TRILOGY',
        email: 'taylorwhite2190@gmail.com',
      })

      await addBook({
        title: 'The Thusday War',
        description: 'Halo: The Thursday War is a direct follow-up to Glasslands. The book was released on October 2, 2012.[5] Recovering from an attack by the Jiralhanae, Dr. Evan Phillips looks for a way to escape his entrapment as Avu Med Telcam gears up for an attack against the Arbiter. Kilo-Five must return to Sanghelios to retrieve their fallen comrade before he is lost in the fray, temporarily abandoning another growing priority on the rebel-leaning planet Venezia. Meanwhile Jul Mdama looks for a way to escape his confinement inside the enormous shield world and soon learns of an ancient entity that once held a hatred for humanity. All while this is taking place, the UNSC Infinity is set on a course to undergo her first space trials thanks to newly incorporated Forerunner technology.',
        status: 'FAVE TRILOGY',
        email: 'taylorwhite2190@gmail.com',
      })

      await addBook({
        title: 'Mortal Dictata',
        description: 'Halo: Mortal Dictata is the third and final installment of the trilogy. It was released on January 21, 2014.[6][9] Naomi-10s father, Insurrectionist Staffan Sentzke, acquires a CCS-class battlecruiser, Pious Inquisitor, from Kig-Yar pirate Sav Fel. With it, he intends to threaten Earth with glassing in order to coerce the authorities into providing answers about his daughters disappearance decades earlier. It is Kilo-Fives mission to apprehend Staffan and end his terrorist plots. Kilo-Five must test their loyalties and prevent Naomis family ties from compromising the mission to stop her father. Meanwhile, Avu Med Telcam hires Kig-Yar Shipmistress Chol Von to steal back the Inquisitor, after Fel had stolen it from him. However, Von intends to steal the ship for herself to use it for her united Kig-Yar navy.',
        status: 'FAVE TRILOGY',
        email: 'taylorwhite2190@gmail.com',
      });

    }
  });


async function addBook(obj) {
  let newBook = new BookModel(obj);
  return await newBook.save();
}

async function clear(req, res) {
  console.log('test clear')
  try {
    await BookModel.deleteMany({});
    res.send('DB destroyed');
  }
  catch (err) {
    res.send('DB is too strong, try again')
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
