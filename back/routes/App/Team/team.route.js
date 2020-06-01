const router = require('express').Router();
let User = require('../../../models/user.model');
let Team = require('../../../models/team.model');

router.post('/:userId', async (req, res) => {
   const {userId} = req.params;
   const bodyTeam = req.body;

   try{
      bodyTeam.coaches = [userId];
      bodyTeam.players = [userId];
      let newTeam = await new Team(bodyTeam);
      let teamResult = await newTeam.save();
      const serResult = await User.findByIdAndUpdate(userId, {$push: {"teams":teamResult._id}});   

      return res.status(200).json(teamResult);

   } catch (err) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'This already exists' });
      }
      res.status(500).json({ error: 'Server error' });
   }
});

module.exports = router;
