// utility module, importing functions from zookeeper.js
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require("../../lib/zookeepers.js");
// importing zookeeper information form zookeepers.json
const { zookeepers } = require('../../data/zookeepers');

// start an instance of Router.
// Routing refers to determining how an application responds to a client
// request to a particular endpoint, which is a URI (or path) and
// a specific HTTP request method (GET, POST, and so on).
const router = require('express').Router();


router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// order of routes is important. A params route must come after
// the other GET routes
router.get('/zookeepers/:id', (req, res) => {
    // req.params allows us to query for a specific zookeeper, rather
    // than an entire array of all the zookeepers. The params object needs
    // to be defined in the route path, as shown above, i.e.
    // /api/zookeepers/:id. The req.params filters by a single property, often
    // intended to retrieve a single record, i.e. the id of a particular zookeeper
    // This is in contrast to req.query, which is multifaceted, combining multiple
    // parameters 
    const result = findById(req.params.id, zookeepers);
    if(result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
});

// POST request made from client side to server to accept data, rather
// than retrieving data as in a GET request
router.post('/zookeepers', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = zookeepers.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateZookeeper(req.body)) {
      res.status(400).send('The zookeepers is not properly formatted.');
    } else {
    // add zookeepers to json file and zookeepers array in this function
    const zookeeper = createNewZookeeper(req.body, zookeepers);
    res.json(zookeeper);
    }
});

module.exports  = router;