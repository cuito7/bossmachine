const express = require('express');
//const { router } = require('../server.js');
const apiRouter = express.Router();
const {
  createMeeting,
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  deleteAllFromDatabase,
} = require('../server/db.js');

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

apiRouter.param('minionId', (req, res, next, id) => {
  const minion = getFromDatabaseById('minions', id);
  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send();
  }
});

apiRouter.param('ideaId', (req, res, next, id) => {
  const idea = getFromDatabaseById('ideas', id);
  if (idea) {
    req.idea = idea;
    next();
  } else {
    res.status(404).send('Idea not found!');
  }
});

apiRouter.param('workId', (req, res, next, id) => {
  const work = getFromDatabaseById('work', id);
  if (work) {
    req.work = work;
    next();
  } else {
    res.status(404).send('Idea not found!');
  }
});

apiRouter.get('/minions', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

apiRouter.get('/minions/:minionId', (req, res, next) => {
  res.send(req.minion);
});

apiRouter.get('/minions/:minionId/work', (req, res, next) => {
  const minionWork = getAllFromDatabase('work').filter((element) => {
    element.minionId = req.params.minionId;
  });
  res.send(minionWork);
});

apiRouter.put('/minions/:minionId', (req, res, next) => {
  const updatedMinion = updateInstanceInDatabase('minions', req.body);
  res.send(updatedMinion);
});

apiRouter.put('/minions/:minionId/work/:workId', (req, res, next) => {
  if (req.params.minionId !== req.body.minionId) {
    res.status(400).send();
  } else {
    updatedWork = updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
  }
});

apiRouter.post('/minions', (req, res, next) => {
  const newMinion = addToDatabase('minions', req.body);
  if (newMinion) {
    res.status(201).send(newMinion);
  } else {
    res.status(400).send('Minion not found!');
  }
});

apiRouter.post('/minions/:minionId/work', (req, res, next) => {
  const workToAdd = req.body; 
  workToAdd.minionId = req.params.minionId;
  const addedWork = addToDatabase('work', workToAdd);
  if (addedWork) {
    res.status(201).send(addedWork);
  } else {
    res.status(400).send('Work not found!');
  }
});

apiRouter.delete('/minions/:minionId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('minions', req.params.minionId);
  if (deleted) {
    res.status(204);
  } else {
    res.status(500);
  }
  res.send();
});

apiRouter.delete('/minions/:minionId/work/:workId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('work', req.params.workId);
  if (deleted) {
    res.status(204);
  } else {
    res.status(500);
  }
  res.send();
});

apiRouter.get('/ideas', (req, res, next) => {
  res.send(getAllFromDatabase('ideas'));
});

apiRouter.get('/ideas/:ideaId', (req, res, next) => {
  res.send(req.idea);
});

apiRouter.put('/ideas/:ideaId', checkMillionDollarIdea, (req, res, next) => {
  const updatedIdea = updateInstanceInDatabase('ideas', req.body);
  res.send(updatedIdea);
});

apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
  const newIdea = addToDatabase('ideas', req.body);
  if (newIdea) {
    res.status(201).send(newIdea);
  } else {
    res.status(400).send('Idea not found!');
  }
});

apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('ideas', req.params.ideaId);
  if (deleted) {
    res.status(204);
  } else {
    res.status(500);
  }
  res.send();
});

apiRouter.get('/meetings', (req, res, next) => {
  res.send(getAllFromDatabase('meetings'));
});

apiRouter.post('/meetings', (req, res, next) => {
  const newMeeting = addToDatabase('meetings', createMeeting());
  if (newMeeting) {
    res.status(201).send(newMeeting);
  } else {
    res.status(400).send('Meeting not found!');
  }
});

apiRouter.delete('/meetings', (req, res, next) => {
  deleteAllFromDatabase('meetings');
  res.status(204).send();
});


module.exports = apiRouter;
