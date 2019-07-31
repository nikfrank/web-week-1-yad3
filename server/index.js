const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const connectionString = 'postgres://yad3:guest@localhost:5432/yad3';

const ORM = require('sequelize');
const connection = new ORM(connectionString, { logging: false });

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
}, { freezeTableName: true });

app.use( express.json() );

connection.authenticate()
  .then(()=> console.log('success'))
  .catch(()=> console.log('failure'));

app.get('/hydrate', (req, res)=> {
  Listing.sync({ force: true })
    .then(()=> res.json({ message: 'successfully created table' }))
    .catch(err=> {
      console.error(err);
      res.status(500).json({ message: 'failed to create table' });
    });
});

app.post('/listing', (req, res)=> {
  Listing.create(req.body)
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


app.listen(port, ()=> console.log('listening on port '+port));
