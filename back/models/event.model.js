const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
   type: {
      type: String,
      required: true
   },
   opponent: {
      type: String,
   },
   homeOrAway: {
      type: String,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      required: true
   },
   time: {
      type: String,
      required: true
   },
   duration: {
      type: String,
      required: true
   },
   notes: {
      type: String,
   },
   teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
   },
}, {
   timestamps: true,
 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;