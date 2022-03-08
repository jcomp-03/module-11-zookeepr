// we'll require the Express.js npm package
const express = require('express');
// creating a route that the front-end
// can request data from. Start by requiring the data
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

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
  const result = findById(req.params.id, animals);
  if(result) {
    res.json(result);
  } else {
    res.sendStatus(404);
  }
})

// make our server listen by chaining the .listen method
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });