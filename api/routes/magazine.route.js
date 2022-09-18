// magazine.route.js

const express = require('express');
const app = express();
const magazineRoutes = express.Router();

// Require Magazine model in our routes module
let Magazine = require('../models/Magazine');

// Defined store route
magazineRoutes.route('/add').post(function (req, res) {
  let magazine = new Magazine(req.body);
  magazine.save()
    .then(magazine => {
      res.status(200).json({'magazine': 'magazine in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
magazineRoutes.route('/').get(function (req, res) {
  Magazine.find(function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

// Defined edit route
magazineRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Business.findById(id, function (err, business){
      res.json(business);
  });
});




// Update Magazin
magazineRoutes.route('/update/:id').put((req, res, next) => {
  Business.findByIdAndUpdate(req.params.id, {
  $set: req.body
}, (error, data) => {
  if (error) {
    return next(error);
    console.log(error)
  } else {
    res.json(data)
    console.log("REQUEST BODY",req.body)
    console.log(req.params.id,'Magazin updated successfully!', data)
  }
})
})


// Defined delete | remove | destroy route
magazineRoutes.route('/delete/:id').get(function (req, res) {
    Business.findByIdAndRemove({_id: req.params.id}, function(err, business){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = magazineRoutes;
