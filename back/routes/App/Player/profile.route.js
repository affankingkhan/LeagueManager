const router = require('express').Router();
let User = require('../../../models/user.model');


router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.get('/:userid', async (req, res) => {
   const {userid} = req.params;
   await User.findById(userid)
     .then(users => res.json(users))
     .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/updateinfo/:userid', async (req, res) => {
   const new_info = req.body;
   const {userid} = req.params;
   const user = await User.findById(userid);

   user.firstName = new_info.firstName;
   user.lastName = new_info.lastName;

   await user.save()
   .then(() => {
      return res.status(200).json(user);
   })
    .catch(err => res.status(400).send(`Error: ${err}`));
})


router.post('/updatepassword/:userid', async (req, res) => {
   const new_password = req.body.newPassword;
   const {userid} = req.params;
   const user = await User.findById(userid);

   user.password = user.generateHash(new_password);

   await user.save()
   .then(() => {
      return res.status(200).json(user);
   })
    .catch(err => res.status(400).send(`Error: ${err}`));
})



router.route('/delete/:userid').delete((req, res) => {
  User.findByIdAndDelete(req.params.userid)
    .then(() => res.json('User deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
