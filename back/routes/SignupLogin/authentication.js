const router = require('express').Router();
const Team = require('../../models/team.model');
const User = require('../../models/user.model');
const auth = require('../../middleware/auth');
const { sendSignupEmail } = require('./emailer');

router.route('/signup').post(async (req, res) => {
   const { firstName, lastName, password, teamName } = req.body;
   let { email } = req.body;

   if(!firstName) { return res.status(400).json(`Error: First name can't be empty`); }
   if(!lastName) { return res.status(400).json(`Error: Last name can't be empty`); }
   if(!password) { return res.status(400).json(`Error: Password can't be empty`); }
   if(!email) { return res.status(400).json(`Error: Email can't be empty`); }

   /**
    * Steps:
    * 1. Verify email doesn't exists
    * 2. Save
    */
   email = email.toLowerCase();
   await User.find({email: email}, async (err, users) => {
      if(err) {
         return res.status(400).json(`Error: ${err}`);
      }
      if(users.length > 0) {
         //console.log(users);
         return res.status(400).json(`Error: Email already in use`);
      }
   }).catch(err => res.status(400).json(`Error: ${err}`));

   const userBody = new User();
   userBody.email = email;
   userBody.firstName = firstName;
   userBody.lastName = lastName;
   userBody.password = userBody.generateHash(password);

   let newUser = await userBody.save().catch(err => res.status(400).send(`Error: ${err}`));

   sendSignupEmail(email, newUser, password);

   let newTeam = new Team({name: teamName, coaches: [newUser._id], players:[newUser._id]});
   let teamResult = await newTeam.save();
   const UserResult = await User.findByIdAndUpdate(newUser._id, {$push: {"teams":teamResult._id}});

   const token = newUser.generateAuthToken();
   res.send(token);
});

router.route('/signin').post(async (req, res) => {
   const password = req.body.password;
   let email = req.body.email;

   if(!email) {
      res.status(400).json(`Error: Email can't be empty`);
   }
   if(!password) {
      res.status(400).json(`Error: Password can't be empty`);
   }

   email = email.toLowerCase();

   await User.find({email})
      .then(users => {
         if(users.length !== 1) {
            return res.status(400).json(`Error: Invalid email or password`);
         }

         // Check for correct password
         const user = users[0];

         if(!user.validPassword(password)) {
            return res.status(400).json(`Error: Invalid email or password`);
         }

         const token = user.generateAuthToken();
         //console.log(token);
         return res.send(token);
      })
      .catch(err => res.status(400).json(`Error: ${err}`));
});


module.exports = router;
