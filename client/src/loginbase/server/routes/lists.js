const HeroList = require('../models/lists'); // Import the HeroList model
const lowdb = require('../../../db.json'); // Import your lowdb instance
const express = require('express');
const router = express.Router();
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { query } = require('express-validator');

// ... rest of your route definitions

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', express.static('../client'));

// Initialize lowdb
const adapter = new FileSync('../db.json');
const db = lowdb(adapter);

// Ensure default data is set in the database if it's empty
function initializeDatabase() {
    const hasPowers = db.has('powers').value();
    const hasInfo = db.has('info').value();

    if (!hasPowers || !hasInfo) {
        const powersjson = require('../superheroes/superhero_powers.json');
        const infojson = require('../superheroes/superhero_info.json');
        db.defaults({ powers: powersjson, info: infojson }).write();
    }
}

initializeDatabase();
app.use('/api/superheroes', router);

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});



// Helper function to calculate average rating
function calculateAverageRating(ratings) {
  if (ratings.length === 0) {
    return 0; // No ratings yet
  }
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}

// Function to fetch hero details from lowdb
async function fetchHeroDetails(heroIds) {
  const heroes = lowdb.heroes; // Assuming heroes are stored in this way
  return heroIds.map(id => heroes.find(hero => hero.id === id));
}

// Function to add rating to a list
async function addRatingToList(listId, rating) {
  try {
    const list = await HeroList.findById(listId);
    list.ratings.push(rating);
    const updatedList = await list.save();
    console.log('Rating added, list updated:', updatedList);
  } catch (err) {
    console.error('Error updating list:', err);
  }
}

// Function to fetch and process hero lists
async function fetchAndProcessHeroLists() {
  try {
    const lists = await HeroList.find().sort({ lastModified: -1 }).limit(10).populate('creator', 'nickname');
    const enhancedLists = await Promise.all(lists.map(async list => {
      const averageRating = calculateAverageRating(list.ratings);
      const heroDetails = await fetchHeroDetails(list.heroes);

      return {
        ...list.toObject(),
        numberOfHeroes: heroDetails.length,
        averageRating: averageRating,
        heroesDetails: heroDetails // Optional
      };
    }));

    console.log(enhancedLists);
  } catch (err) {
    console.error('Error fetching lists:', err);
  }
}


// POST endpoint to add a rating to a list
router.post('/lists/:listId/rate', async (req, res) => {
    try {
      const { listId } = req.params;
      const { rating } = req.body; // Ensure that rating is passed in the request body
      await addRatingToList(listId, rating);
      res.status(200).json({ message: 'Rating added successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

// GET endpoint to fetch processed hero lists
router.get('/lists', async (req, res) => {
    try {
      const lists = await fetchAndProcessHeroLists();
      res.status(200).json(lists);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
// Example usage
fetchAndProcessHeroLists();
