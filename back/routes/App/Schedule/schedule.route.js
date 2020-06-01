const router = require("express").Router();
let Event = require('../../../models/event.model')
let Team = require('../../../models/team.model');
/**
 * return all the event associated with a team
 */
router.post('/', (req, res) => {
  let teamId = req.body.teamId;
  if(!teamId){
      res.status(400).json(`Error: Team  does not exist`);
  }

  const currentDate = new Date();

  var returnedEvents = {};


  // get all events that are past
  Event.find({teamId: teamId, date:{$lt: currentDate}})
    .sort({date:'desc'})
    .then(events => {
      returnedEvents['pastEvents'] = events
    })
    .catch(err => res.status(400).json('Error: ' + err));

      // get all events that are after
  Event.find({teamId: teamId, date:{$gte: currentDate}})
  .sort({date:'asc'})
  .then(events => {
    returnedEvents['futureEvents'] = events;
    res.json(returnedEvents)
  })
  .catch(err => res.status(400).json('Error: ' + err));

});

// add event to a team
router.post('/add', (req,res) => {

  const {type, opponent, homeOrAway, title, date, time, duration, notes, teamId } = req.body;

  if(!type) { return res.status(400).json(`Error: Event must have type`); }
  if(!homeOrAway) { return res.status(400).json(`Error: Event must be either home or away`); }
  if(!title) { return res.status(400).json(`Error: Event must have a title`); }
  if(!date) { return res.status(400).json(`Error: Event must have date`); }
  if(!time) { return res.status(400).json(`Error: Event must have a time`); }
  if(!duration) { return res.status(400).json(`Error: Event must have a duration`); }
  if(!teamId) { return res.status(400).json(`Error: Event must have a team`); }

  const newEvent = new Event();
  newEvent.type = type;
  newEvent.opponent = opponent;
  newEvent.homeOrAway = homeOrAway;
  newEvent.title = title;
  newEvent.date = date;
  newEvent.time = time;
  newEvent.duration = duration;
  newEvent.notes = notes;
  newEvent.teamId = teamId;


  Team.find({'_id': teamId})
      .then(team => {
         if(!team) { return res.status(400).send(`Error: No team exists for the id provided`); }

          const newEvent = new Event();
          newEvent.type = type;
          newEvent.opponent = opponent;
          newEvent.homeOrAway = homeOrAway;
          newEvent.title = title;
          newEvent.date = date;
          newEvent.time = time;
          newEvent.duration = duration;
          newEvent.notes = notes;
          newEvent.teamId = teamId;

          newEvent.save()
              .then(res.status(200).json(newEvent))
              .catch(err => res.status(400).json(`Error: ${err}`));
        })
        .catch(err => res.status(400).send(`Error: ${err}`));

})


router.post('/update', async (req,res) =>{
  let id = req.body._id;
  if(!id){ return res.status(400).json(`Error: event must have an Id`); }
  const event = await Event.findById(id);

  const {type, opponent, homeOrAway, title, date, time, duration, notes } = req.body;

  event.type = type;
  event.opponent = opponent;
  event.homeOrAway = homeOrAway;
  event.title = title;
  event.date = date;
  event.time = time;
  event.duration = duration;
  event.notes = notes;

  await event.save()
   .then(() => {
      return res.status(200).json(event);
   })
    .catch(err => res.status(400).send(`Error: ${err}`));

})

router.post('/delete',(req, res) => {
  Event.findByIdAndDelete(req.body.eventId)
    .then(() => res.json('Event deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;