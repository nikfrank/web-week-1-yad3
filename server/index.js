const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const jwt = require('jsonwebtoken');

const fakeData = require('./fakeData');

const connectionString = 'postgres://yad3:guest@localhost:5432/yad3';

const ORM = require('sequelize');
const connection = new ORM(connectionString, { logging: false });

const calculateHash = require('./hash');

// Models
const Listing = connection.define('listing', {
  id: {
    type: ORM.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: ORM.TEXT,
    allowNull: false,
  },
  description: {
    type: ORM.TEXT,
    allowNull: false,
  },
  price: {
    type: ORM.INTEGER,
  },
  images: {
    type: ORM.ARRAY( ORM.TEXT ),
  },
  author: {
    type: ORM.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },
}, { freezeTableName: true });

const User = connection.define('user', {
  id: {
    type: ORM.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  passwordHash: {
    type: ORM.TEXT,
    allowNull: false,
  },
  email: {
    type: ORM.TEXT,
    allowNull: false,
    unique: true,
  },
}, { freezeTableName: true });

app.use( express.json() );

const auth = (req, res, next)=>{
  const authHeader = req.get('Authorization') || '';

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'jwt secret code', (err, decoded)=>{
    if( err ) return res.status(401).json({ message: 'auth failed' });
    else {
      req.session = decoded;
      next();
    }
  });
};

connection.authenticate()
  .then(()=> console.log('success'))
  .catch(()=> console.log('failure'));

app.get('/hydrate', (req, res)=> {
  User.sync({ force: true })
      .then(()=> User.bulkCreate(fakeData.users))
      .then(()=> Listing.sync({ force: true }))
      .then(()=> Listing.bulkCreate(fakeData.listings))
      .then(()=> res.json({ message: 'successfully created tables' }))
      .catch(err=> {
        console.error(err);
        res.status(500).json({ message: 'failed to create table' });
      });
});

app.post('/listing', auth, (req, res)=> {
  Listing.create({ ...req.body, author: req.session.id })
    .then((response)=>
      res.status(201).json({
        message: 'created',
        created: response.dataValues,
      })
    ).catch(err => {
      console.error(err);
      res.status(500).json({ message: 'create listing failed' });
    });
});

app.get('/listing', (req, res)=> {
  Listing.findAll()
    .then(listings => res.json(listings))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'read listings failed' });
    });
});

app.post('/user', (req, res)=> {
  // sign up
  const passwordHash = calculateHash( req.body.password );

  User.create({
    email: req.body.email,
    passwordHash,
  }).then(()=> res.status(201).json({ message: 'sign up successful' }))
    .catch(()=> res.status(500).json({ message: 'sign up failed' }))
});

app.post('/login', (req, res)=> {
  // login
  const passwordHash = calculateHash( req.body.password );

  User.findOne({ where: { email: req.body.email, passwordHash } })
      .then(userResponse=> {
        if( userResponse ){
          // make jwt
          jwt.sign(
            { id: userResponse.dataValues.id },
            'jwt secret code',
            (err, token)=> res.json({ token })
          );

        } else {
          res.status(401).json({ message: 'login failed' });
        }
      });
});


app.listen(port, ()=> console.log('listening on port '+port));
