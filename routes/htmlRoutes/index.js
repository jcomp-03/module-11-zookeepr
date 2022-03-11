const path = require('path');
const router = require('express').Router();

// GET request. Serves index.html from our Express.js server
// Unlike most GET and POST routes, this route's sole purpose
// is to respond with an HTML page to display in the browser
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// GET request. Serves animals.html. You'll notice the route
// does not have /api in it, because it does not deal in the
// transference of JSON data. It's purely serving up an HTML page
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});  
 
// GET request. Serves zookeepers.html. Same case as above. No /api in the
// route because its purpose is to just spit back an HTML file. Makes
// sense not to describe the route with the word 'api'
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// wildcard route to catch any routes that do not exist. Sends
// back homepage index.html instead. Order matters, this catch-all
// route must come at least or it will supersede good routes
// placed after itself
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;