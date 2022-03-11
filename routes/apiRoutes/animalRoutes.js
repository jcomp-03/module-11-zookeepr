const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// start an instance of Router.
// Routing refers to determining how an application responds to a client
// request to a particular endpoint, which is a URI (or path) and
// a specific HTTP request method (GET, POST, and so on).
const router = require('express').Router();

// adding the route the front-end can request data from
// the get method takes a string which describes the route the
// client will fetch from. the second parameter is a callback which
// is called every time the route is accessed with a GET request.
// Note we're using the send method of the res parameter (short for response)
// to send the string 'Hello' to the client
router.get('/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});


// order of routes is important. A params route must come after
// the other GET routes
router.get('/animals/:id', (req, res) => {
    // req.params allows us to query for a specific animal, rather
    // than an entire array of all the animals. The params object needs
    // to be defined in the route path, as shown above, i.e.
    // /api/animals/:id. The req.params filters by a single property, often
    // intended to retrieve a single record, i.e. the id of a particular animal
    // This is in contrast to req.query, which is multifaceted, combining multiple
    // parameters 
    const result = findById(req.params.id, animals);
    if(result) {
      res.json(result);
    } else {
      res.sendStatus(404);
    }
})


// POST request made from client side to server to accept data, rather
// than retrieving data as in a GET request
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
    }
});

module.exports  = router;