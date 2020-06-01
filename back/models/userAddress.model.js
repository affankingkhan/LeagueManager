const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userAddressSchema = new Schema({
   address: {
      type: String,
      required: true,
      default: ""
   },
   longitude:{
      type: Number,
      required: true,
      default: ""
   },
   latitude:{
      type: Number,
      required: true,
      default: ""
   },
   userId:{
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
}, {
   timestamps: true,
 });

const UserAddress = mongoose.model('userAddress', userAddressSchema);

module.exports = UserAddress;