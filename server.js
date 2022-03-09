// we'll require the following modules/packages
const express = require('express'); // 3rd-party module
const fs = require('fs'); // native to Node.js
const path = require('path'); // native to Node.js
// creating a route that the front-end
// can request data from. Start by requiring the data
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();
// parse incoming string or array data. We used the app.use() method. This is a method executed
// by our Express.js server that mounts a function to the server that our requests will pass through before 
// getting to the intended endpoint. The functions we can mount to our server are referred to as middleware. 
// The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST
// data and converts it to key/value pairings that can be accessed in the req.body object.
// The extended: true option set inside the method call informs our server that there may be sub-array data
// nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
// The express.json() method we used takes incoming POST data in the form of JSON and parses it into the
// req.body JavaScript object. Both of the above middleware functions need to be set up every time you create
// a server that's looking to accept POST data.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// create separate function filterByQuery to run code logic for
// returning only the animals which meet the filtering requirements
// we create this function to not bloat the app.get method below
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

// used in params route further down below
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

// used to add an animal object to the animals array
// used in POST request method
function createNewAnimal(body, animalsArray) {
  // here you set the entirety of the body content to the constant animal
  const animal = body;
  // now you push that object to the end of the animal array
  animalsArray.push(animal);
  // we need to save the Javascript array data as JSON,
  // so we use JSON.stringify() to convert it
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  return animal;
}

// validate the existence and the type of data submitted during POST request
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}



// adding the route the front-end can request data from
// the get method takes a string which describes the route the
// client will fetch from. the second parameter is a callback which
// is called every time the route is accessed with a GET request.
// Note we're using the send method of the res parameter (short for response)
// to send the string 'Hello' to the client
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

// order of routes is important. A params route must come after
// the other GET routes
app.get('/api/animals/:id', (req, res) => {
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
app.post('/api/animals', (req, res) => {
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


// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });