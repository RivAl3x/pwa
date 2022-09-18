// Magazine.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Magazine
let Magazine = new Schema({
  name: {
    type: String
  }
},{
    collection: 'magazine'
});

module.exports = mongoose.model('Magazine', Magazine);
