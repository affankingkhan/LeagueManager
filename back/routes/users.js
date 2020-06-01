const router = require('express').Router();
const auth = require('../middleware/auth');
let User = require('../models/user.model');
let Team = require('../models/team.model');
let UserAddress = require('../models/userAddress.model');
const axios = require('axios').default;

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/teamdropdown', auth, async (req, res) => {
  if(req.user == {}) res.status(400).json('Error: ' + err);
  var dbUser = await User.findById(req.userId).select('-password');
  let teams = await Team.find({"_id": {$in: dbUser.teams}});

  let ret = {user: dbUser, teams: teams}
  res.json(ret)
});


router.get('/me', auth, async (req, res) => {
  // accessing profile page
  const id = req.user._id;
  const user = await User.findById(id).select('-password');

  res.send(user);
});

// @Post addAddress
router.post('/address/:userId', async (req, res) => {
  
  const {userId} = req.params;
  const {userAddress} = req.body;
  let google_key = 'AIzaSyDhy_2nfBjxv7J09kei3kqNlXsdmIpkIx4';
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
    params:{
      address:userAddress,
      key:google_key
    }
  });

  let location = response.data.results[0].geometry.location;


  let dbUserAddress = new UserAddress();
  dbUserAddress.address = userAddress;
  dbUserAddress.longitude = location.lng;
  dbUserAddress.latitude = location.lat;
  dbUserAddress.userId = userId;

  let ret = await dbUserAddress.save();

  return res.json(ret)
});

// @delete addAddress
router.delete('/address/:addressId', async (req, res) => {
  const {addressId} = req.params;

  try{
    let userAddressResult = await UserAddress.remove({_id: addressId})
    return res.status(200).json(userAddressResult);
  }  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
 }
});


module.exports = router;
