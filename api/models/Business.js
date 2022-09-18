// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Business = new Schema({
  name: {
    type: String
  },
  ean: {
    type: String
  },

  price: {
    type: String
  },
  magazin:{
    type: String
  },
  createdAt:{ type : Date, default: Date.now }
},{
    collection: 'pwa'
});

module.exports = mongoose.model('Business', Business);
