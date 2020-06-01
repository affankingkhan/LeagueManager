const router = require('express').Router();
const auth = require('../../../middleware/auth');
const { sendSignupEmail, sendExistingUserEmail } = require('../../SignupLogin/emailer');
let User = require('../../../models/user.model');
let Team = require('../../../models/team.model');
let UserAddress = require('../../../models/userAddress.model');

router.get('/', auth, (req, res) => {
   Team.find()
      .then(teams => res.json(teams))
      .catch(err => res.status(400).json(`Error: ${err}`));
});

router.get('/:teamId', async (req, res) => {
   const {teamId} = req.params;
   const team = await Team.findById(teamId).populate(['players', 'coaches']);
   const playerMapAddress = await UserAddress.find().populate(['userId']);   
   let ret = {team:team, playerMapAddress:playerMapAddress};

   res.status(200).json(ret);
});

router.post('/add', async (req, res) => {
   const { name, coachId } = req.body;

   if(!name) { return res.status(400).json(`Error: Name can't be empty`); }
   if(!coachId) { return res.status(400).json(`Error: Coach can't be empty`); }

   User.find({'_id': coachId})
      .then(coach => {
         if(!coach) { return res.status(400).send(`Error: No user with id`); }

         const team = new Team();
         team.name = name;
         team.coaches.push(coachId);

         team.save()
            .then(res.status(200).json(team))
            .catch(err => res.status(400).json(`Error: ${err}`));
      })
      .catch(err => res.status(400).send(`Error: ${err}`));
});


// @Post addPlayer
router.post('/:teamId', async (req, res) => {
   const {teamId} = req.params;
   const bodyUser = req.body;
   bodyUser.email = bodyUser.email.toLowerCase();
   try{
      const teamArray= await Team.find({ '_id': teamId });
      team = teamArray[0]; // teams are set up previously
      let userArray = await User.find({'email': bodyUser.email})
      let user = {};

      if(userArray.length > 0 && teamArray.length > 0) {
         user = userArray[0];
         // 1. Add existing user to team
         team.players.push(user._id);
         // 2. Let user know they're in new team
         sendExistingUserEmail(user, team);

      }
      else {
         
         let newUser = await new User();
         newUser.firstName = bodyUser.firstName;
         newUser.lastName = bodyUser.lastName;
         newUser.email = bodyUser.email;

         // 2. Generate random password
         let randomPassword = Math.random().toString(36).substr(2, 8);
         newUser.password = newUser.generateHash(randomPassword);
         
         await newUser.save()
            .then(() => {
               // 3. Let user know they've been invited to team
               user = newUser;
               sendSignupEmail(newUser.email, newUser, randomPassword);
               return;
            })
            .catch(err => res.status(400).send(`Error: ${err}`));
      }
      const serResult = await User.findByIdAndUpdate(user._id, {$push: {"teams":team._id}});   
      const teamResult = await Team.findByIdAndUpdate(team._id, {$push: {"players":user._id}});   
      return res.status(200).json(teamResult);
   } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'This already exists' });
      }
      res.status(500).json({ error: 'Server error' });
   }
});


// @Delete remove from the team.
router.delete('/:teamId', async (req, res) => {
   const {teamId} = req.params;
   const bodyUser = req.body;

   try{
      const user = await User.findByIdAndUpdate(bodyUser._id, {$pull: {"teams":teamId}});
      const team = await Team.findByIdAndUpdate(teamId, {$pull: {"players":bodyUser._id}});

      return res.status(201).json({
          success: true,
          data: user
      });
  } catch(err){
      console.log(err);
      res.status(500).json({error:'Server error'});
  }
});



// @Put updatePlayer
router.put('/:teamId', async (req, res) => {

});

module.exports = router;