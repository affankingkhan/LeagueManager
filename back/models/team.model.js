const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
   name: {
      type: String,
      required: true,
      default: ""
   },
   leagueName:{
      type: String,
      required: false,
      default: ""
   },
   season:{
      type: String,
      required: false,
      default: ""
   },
   division:{
      type: String,
      required: false,
      default: ""
   },
   sport:{
      type: String,
      required: false,
      default: ""
   },
   coaches: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }],
   players: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }],
}, {
   timestamps: true,
 });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;