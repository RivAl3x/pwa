// business.route.js

const express = require('express');
const app = express();
const businessRoutes = express.Router();

// Require Business model in our routes module
let Business = require('../models/Business');

// Defined store route
businessRoutes.route('/add').post(function (req, res) {
  let business = new Business(req.body);
  business.save()
    .then(business => {
      res.status(200).json({'business': 'business in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
  console.log( req.params, req.query)
    Business.find(req.query, function (err, businesses){
    if(err){
      console.log(err);
    }
    else {
      res.json(businesses);
    }
  });
});

// Defined edit route
businessRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Business.findById(id, function (err, business){
      res.json(business);
  });
});

//  Defined update route
// businessRoutes.route('/update/:id').post(function (req, res) {
//   Business.findById(req.params._id, function(err, next, business) {
//   if (!business)
//     return next(new Error('Could not load Document'));
//   else {

//       business.name = req.body.name;
//       business.ean = req.body.ean;
//       business.price = req.body.price;

//       business.save().then(business => {
//         res.json('Update complete');
//     })
//     .catch(err => {
//           res.status(400).send("unable to update the database");
//     });
//   }
// });
// });



// Update Book
businessRoutes.route('/update/:id').put((req, res, next) => {
  Business.findByIdAndUpdate(req.params.id, {
  $set: req.body
}, (error, data) => {
  if (error) {
    return next(error);
    console.log(error)
  } else {
    res.json(data)
    console.log("REQUEST BODY",req.body)
    console.log(req.params.id,'Book updated successfully!', data)
  }
})
})


// Defined delete | remove | destroy route
businessRoutes.route('/delete/:id').delete(function (req, res) {
    Business.findByIdAndRemove({_id: req.params.id}, function(err, business){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = businessRoutes;
