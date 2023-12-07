const express = require('express');
const cors = require('cors');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { query } = require('express-validator');
require('../loginbase/server/db');
require('mongoose');
 // This ensures your DB connection is established
// Rest of your server setup

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
const router = express.Router();
app.use('/api/superheroes', router);

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
    
});

router.route('/')//All the routes to the base prefix
    .get((req,res) =>{//get a list of parst
      const superheroes = db.get('info').value();
    res.send(superheroes);
    })

// Call the function to load superheroes when starting the server
const superheroes = db.get('powers').value();
const superhero_pub = db.get('info').value();
router.get('/search/power', async (req, res) => {
  let { power, second, pattern, n } = req.query;
  n = n ? parseInt(n, 10) : undefined;

  if (!power || !second || !pattern) {
    return res.status(400).send('Required query parameters are missing');
  }

  const regex = new RegExp(pattern, 'i');

  try {
    // Filter superheroes based on power
    const superheroesWithPower = superheroes.filter(hero =>
      Object.entries(hero).some(([key, value]) => key === power && value === "True")
    );

    // Map to names for further filtering
    const superheroNamesWithPower = superheroesWithPower.map(hero => hero.hero_names);

    // Filter superhero_pub based on the second condition and limit the names to those with the power
    const filteredSuperheroes = superhero_pub.filter(sh =>
      superheroNamesWithPower.includes(sh.name) && regex.test(sh[second])
    );
    console.log(filteredSuperheroes)

    if (filteredSuperheroes.length === 0) {
      return res.status(404).send('No superheroes found with the given criteria');
    }

    // Limit the number of results if 'n' is provided
    const limitedResults = n ? filteredSuperheroes.slice(0, n) : filteredSuperheroes;

    // Prepare final result
    const superheroesWithIds = limitedResults.map(sh => {
      const superheropowers = superheroes.find(hero => hero.hero_names === sh.name);
      const powers = Object.entries(superheropowers)
        .filter(([key, value]) => value === "True" && key !== "hero_names")
        .map(([key]) => key);

      return {
        powers: powers,
        name: sh.name, 
        id: sh.id, 
        Gender: sh.Gender,
        Eye: sh["Eye color"],
        Race: sh.Race,
        Hair: sh["Hair color"],
        Height: sh.Height,
        Publisher: sh.Publisher,
        Skin: sh["Skin color"],
        Alignment: sh.Alignment,
        Weight: sh.Weight
      };
    });

    res.json(superheroesWithIds);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



router.get('/:id/powers', async (req, res) => {
  try{
    console.log("whatever");
       // Extract the name from the request parameters
    const superheroName = parseInt(req.params.id);

const superheroDetails= [];
  const superhero = superhero_pub.find(sh => sh.id === superheroName);

    console.log(superhero.name);
    console.log(superhero.Gender);
    if (superhero) {
      const superheropowers = superheroes.find(sh => sh.hero_names === superhero.name);
      if (superheropowers) {
        const powers = Object.entries(superheropowers)
          .filter(([key, value]) => value === "True" && key !== "hero_names")
          .map(([key]) => key);
          let eyeColor = superhero["Eye color"];
          let skin = superhero["Skin color"];
          let Hair = superhero["Hair color"];
        superheroDetails.push({
          id: superheroName,
          name: superhero.name,
          gender: superhero.Gender,
          Eye_Color: eyeColor,
          race:superhero.Race,
          Hair:Hair,
          Height: superhero.Height,
          Publisher:superhero.Publisher,
          Skin: skin,
          Alignment:superhero.Alignment,
          Weight: superhero.Weight,
          powers: powers,

          
        });
      } else {
        let eyeColor = superhero["Eye color"];
          let skin = superhero["Skin color"];
          let Hair = superhero["Hair color"];
        superheroDetails.push({
          id: superheroName,
          name: superhero.name,
          gender: superhero.Gender,
          Eye_Color: eyeColor,
          race:superhero.Race,
          Hair:Hair,
          Height: superhero.Height,
          Publisher:superhero.Publisher,
          Skin: skin,
          Alignment:superhero.Alignment,
          Weight: superhero.Weight,
          powers: [] // No powers found
        });
      }
      res.status(200).json({
        message: 'Superhero details fetched successfully.',
        superheroes: superheroDetails
      });
    
    }
   } catch (error) {
      console.error('Server error:', error);
      res.status(500).send('Server error');
    }
    });




router.get('/:id/publisher', async (req, res) => {
    try {

    const superheropublisher = parseInt(req.params.id);

    const superheropublisherid = superhero_pub.find(sh => sh.id === superheropublisher);
// If the superhero is not found, send a 404 response
if (!superheropublisherid) {
    return res.status(404).send('Superhero not found');
  }
  res.json({ publisher: superheropublisherid.Publisher });
}
    catch (error) {
        // If there's an error, send a 500 response
        res.status(500).send('Server error');
      }
});  
router.get('/publishers', async (req, res) => {
  try {
    // Create a set of unique publisher names
    const publisherSet = new Set(superhero_pub.map(hero => hero.Publisher));

    // Convert the set back into an array
    const publishers = [...publisherSet];

    // Send the list of unique publisher names
    res.json(publishers);
  } catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
});

router.get('/search', [
  // Validate 'field' is one of the allowed fields
  query('field').isIn(['name', 'powers', 'Publishers', 'Race']).withMessage('Invalid search field'),

  query('second').isIn(['name', 'powers', 'Publishers', 'Race']).withMessage('Invalid search field'),

  // Validate 'pattern' is not empty and is a string
  query('pattern').isString().notEmpty().withMessage('Pattern must be provided'),

  query('secondpattern').isString().notEmpty().withMessage('Pattern must be provided'),

  // Validate 'n' is an integer and is optional
  query('n').optional().isInt({ min: 1 }).withMessage('n must be a positive integer')]
  , (req, res) => {

   const field = req.query.field instanceof Array ? req.query.field[0] : req.query.field;
   const second = req.query.second instanceof Array ? req.query.second[0] : req.query.second;
   const pattern = req.query.pattern instanceof Array ? req.query.pattern[0] : req.query.pattern;
   const secondpattern = req.query.secondpattern instanceof Array ? req.query.secondpattern[0] : req.query.secondpattern;
   const n = req.query.n instanceof Array ? parseInt(req.query.n[0], 10) : parseInt(req.query.n, 10);
  console.log(field);
  if (!field || !second || !pattern || !secondpattern) {
    return res.status(400).send('Search field and pattern must be provided');
  }

  // Perform the search with case-insensitive matching
  const softPattern = pattern.replace(/\s+/g, '').toLowerCase();
  const regex = new RegExp(softPattern, 'i');
  
  const secondRegex = new RegExp(secondpattern, 'i');
 console.log(second);
 console.log(pattern);
 console.log(secondpattern);


  superhero_pub.forEach(sh => {
    if (regex.test(sh[second])) {
      console.log(`Match found for ${second}:`, sh);
    }
  });
  
  
  console.log("Before filtering:", superhero_pub.length);
  console.log(regex,secondRegex);
  const filteredSuperheroes = superhero_pub.filter(sh => {
    // Check if the field is 'powers' and if so, search within the powers array
    if (field === 'powers'||second === 'powers') {
      return sh.powers.some(power => regex.test(power));
    } else {
      const isFirstConditionMet = regex.test(sh[field]);
      const isSecondConditionMet = secondRegex.test(sh[second]);
  
      return isFirstConditionMet&&isSecondConditionMet;

    }
  });

  console.log("After filtering:", filteredSuperheroes.length);
  // Limit the number of results if 'n' is provided
  const limitedResults = n ? filteredSuperheroes.slice(0, n) : filteredSuperheroes;
  

  // Respond with the search results
  res.json(limitedResults);
});


router.get('/:id', (req, res) => {
    try {

        const superheroid = parseInt(req.params.id);
    
        const superhero = superhero_pub.find(sh => sh.id === superheroid);
    // If the superhero is not found, send a 404 response
    if (!superhero) {
        return res.status(404).send('Superhero not found');
      }
      res.json([superhero]);
    }
        catch (error) {
            // If there's an error, send a 500 response
            res.status(500).send('Server error');
          }
});

app.post('/api/lists', async(req, res)=>{
  // Extract the list name and the superheroes from the request body
  try {
    
  const { listName } = req.body;


  // Check if the list name already exists
  const listExists = db.has(`lists.${listName}`).value();

  if (listExists) {
      // If the list name exists, return an error
      return res.status(400).send('List name already exists.');
  }

  // If the list name does not exist, create the new list
  db.set(`lists.${listName}`, []).write();

  // Return the newly created list
  res.status(201).json({
      message: 'New list created successfully.',
      listName: listName,

      
  });
}catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
});

app.post('/api/lists/:listName', async (req, res) => {
  const { listName } = req.params;
  const { superheroIds, description, visibility = 'private', nickname } = req.body;

  // Validation
  if (!Array.isArray(superheroIds) || 
      (description && typeof description !== 'string') || 
      (visibility && !['public', 'private'].includes(visibility)) || 
      (nickname && typeof nickname !== 'string')) {
    return res.status(400).send('Invalid input data.');
  }

  let list = db.get(`lists.${listName}`).value();

  if (list) {
    // Update existing list
    list.superheroes = [...new Set([...list.superheroes, ...superheroIds])]; // Combine and deduplicate IDs
    list.description = description || list.description; // Update description if provided
    list.visibility = visibility; // Update visibility
    list.nickname = nickname || list.nickname; // Update nickname if provided
  } else {
    // Create a new list with default visibility set to 'private'
    list = {
      superheroes: superheroIds,
      description: description || '', // Set description if provided
      visibility: visibility, // Set visibility
      nickname: nickname || '' // Set nickname if provided
    };
  }

  // Update the list and last modified date in the database
  db.set(`lists.${listName}`, list)
    .set(`lastModified.${listName}`, new Date().toISOString())
    .write();

  res.status(200).json({
    message: 'List updated successfully',
    list: db.get(`lists.${listName}`).value(),
    lastModified: db.get(`lastModified.${listName}`).value()
  });
});

app.put('/api/lists/:listName', async (req, res) => {
  const { listName } = req.params;
  const { superheroes, description, visibility } = req.body;

  // Basic validation
  if (!Array.isArray(superheroes) || typeof description !== 'string' || !['public', 'private'].includes(visibility)) {
    return res.status(400).send('Invalid input data.');
  }

  let list = db.get(`lists.${listName}`).value();
  
  if (!list) {
    return res.status(404).send('List not found.');
  }

  // Update the list
  list = {
    ...list,
    superheroes,
    description,
    visibility,
    lastModified: new Date().toISOString() // Update last modified time
  };

  db.set(`lists.${listName}`, list).write();

  res.status(200).json({
    message: 'List updated successfully',
    superheroes,
    list
  });
});


app.get('/api/lists/:listName', async (req, res) => {
  try {
    const { listName } = req.params;

    if (!db.has(`lists.${listName}`).value()) {
      return res.status(404).send('List name does not exist.');
    }

    const list = db.get(`lists.${listName}`).value();

    // Check if the superheroes array exists and is an array
    if (!list.superheroes || !Array.isArray(list.superheroes)) {
      return res.status(500).send('Invalid list structure.');
    }

    let superheroDetails = [];
    for (let heroId of list.superheroes) {
      const superhero = superhero_pub.find(sh => sh.id === heroId);
      if (superhero) {
        const superheropowers = superheroes.find(sh => sh.hero_names === superhero.name);
        const powers = superheropowers ? Object.entries(superheropowers)
          .filter(([key, value]) => value === "True" && key !== "hero_names")
          .map(([key]) => key) : [];

        superheroDetails.push({
          id: heroId,
          name: superhero.name,
          gender: superhero.Gender,
          Eye_Color: superhero["Eye color"],
          race: superhero.Race,
          Hair: superhero["Hair color"],
          Height: superhero.Height,
          Publisher: superhero.Publisher,
          Skin: superhero["Skin color"],
          Alignment: superhero.Alignment,
          Weight: superhero.Weight,
          powers: powers,
        });
      }
    }

    res.status(200).json({
      message: 'Superhero details fetched successfully.',
      listName: listName,
      description: list.description || 'No description provided',
      visibility: list.visibility || 'private',
      superheroes: superheroDetails,
      reviews: list.reviews || [],
      lastModified: db.get(`lastModified.${listName}`).value(),
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});


app.get('/api/lists', async (req, res) => {
  try {
    const lists = db.get('lists').value();
    const lastModified = db.get('lastModified').value();
    const reviews = db.get('reviews').value();

    const detailedLists = Object.entries(lists).map(([listName, listData]) => {
      // Fetch reviews for each specific list
      const listReviews = Object.values(reviews).filter(review => review.listName === listName);

      let superheroDetails = [];
      if (listData.superheroes && Array.isArray(listData.superheroes)) {
        superheroDetails = listData.superheroes.map(heroId => {
          const superhero = superhero_pub.find(sh => sh.id === heroId);
          return superhero ? {
            id: heroId,
            name: superhero.name,
            gender: superhero.Gender,
            Eye_Color: superhero["Eye color"],
            race: superhero.Race,
            Hair: superhero["Hair color"],
            Height: superhero.Height,
            Publisher: superhero.Publisher,
            Skin: superhero["Skin color"],
            Alignment: superhero.Alignment,
            Weight: superhero.Weight,
            powers: superhero.powers || [],
          } : null;
        }).filter(hero => hero !== null);
      }

      const averageRating = listData.ratings && listData.ratings.length > 0 
                            ? listData.ratings.reduce((a, b) => a + b, 0) / listData.ratings.length 
                            : 0;

      return {
        name: listName,
        superheroes: superheroDetails,
        averageRating,
        description: listData.description || 'No description provided',
        visibility: listData.visibility || 'private',
        reviews: listReviews,
        lastModified: lastModified[listName] || new Date().toISOString()
      };
    });

    // Sort and limit the lists
    detailedLists.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    const limitedLists = detailedLists.slice(0, 20);

    res.status(200).json(limitedLists);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
      const reviews = db.get('reviews').value();

      // Create an array of reviews with their IDs
      const reviewsWithIds = Object.entries(reviews).map(([id, reviewData]) => {
          return {
              id, // The review ID (e.g., "review1", "review2")
              ...reviewData // The rest of the review data
          };
      });

      // Optionally filter based on 'hidden' status if needed
      const filteredReviews = req.query.showHidden === 'false'
          ? reviewsWithIds.filter(review => !review.hidden)
          : reviewsWithIds;

      res.json(filteredReviews);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).send('Error fetching reviews');
  }
});

  
app.put('/api/reviews/:reviewId/hidden', (req, res) => {
  const reviewId = req.params.reviewId;
  console.log(`Toggling hidden status for review with ID: ${reviewId}`); // Debug log

  try {
      const review = db.get('reviews').get(reviewId).value();

      if (!review) {
          return res.status(404).send('Review not found.');
      }

      db.get('reviews').get(reviewId).assign({ hidden: !review.hidden }).write();
      res.send({ message: 'Review hidden status updated.', hidden: !review.hidden });
  } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).send('Internal Server Error');
  }
});




app.delete('/api/lists/:listName', (req, res) => {
  try {
    const { listName } = req.params;
    const list = db.get(`lists.${listName}`).value();

    if (!list) {
      return res.status(404).send('List name does not exist.');
    }

    if (list.visibility !== 'private') {
      return res.status(403).send('Only private lists can be deleted.');
    }

    db.unset(`lists.${listName}`).write();
    res.status(200).send('List deleted successfully.');
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});



const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

app.post('/api/lists/:listName/reviews', async (req, res) => {
  try {
    const { listName } = req.params;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).send('Invalid rating.');
    }

    // Fetch the list from lowdb
    const list = db.get('lists').get(listName).value();

    if (!list) {
      return res.status(404).send('List not found.');
    }

    // Check if the list is public
    if (list.visibility !== 'public') {
      return res.status(403).send('This list is not public.');
    }

    // Generate a unique ID for the review
    const reviewId = uuidv4();
    const reviews = db.get('reviews').value();
    console.log(reviews);
    // Add the review to the reviews object
    db.get('reviews').set(reviewId, {
      listName,
      rating,
      comment,
      hidden: false
    }).write();

    // Add the review ID to the list's reviews array
    const updatedReviews = list.reviews ? [...list.reviews, reviewId] : [reviewId];
    db.get('lists').get(listName).assign({ reviews: updatedReviews }).write();

    res.status(201).send('Review added successfully.');
  } catch (error) {
    res.status(500).send('Index Server Error');
  }
});


const { User } = require('../loginbase/server/models/user');
const adminRoutes = require('../loginbase/server/routes/admin');
const auth = require('../loginbase/middleware/auth');
const adminAuth = require('../loginbase/server/routes/admin');

app.use(auth);
app.use('/admin', auth, adminRoutes);

const { MongoClient, ObjectId } = require('mongodb');




// Assuming these details are correct and stored in your environment or config
const mongoUri = 'mongodb+srv://saahash:happylife@login.nquijq4.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'test';





async function promoteUserToAdmin(userId) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const database = client.db(dbName);
        const usersCollection = database.collection('users');
        
        let userObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            console.error("Invalid ObjectId format for userId:", userId);
            throw new Error("Invalid ObjectId format");
        }
        const user = await usersCollection.findOne({ _id: userObjectId });
        console.log("Find one User",user);
        console.log("Promoting user with ObjectId:", userObjectId);

        const result = await usersCollection.findOneAndUpdate(
            { _id: userObjectId },
            { $set: { isAdmin: true } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            console.log("No user found with ID:", userObjectId);
            return null;
        }

        return result.value;
    } catch (error) {
        console.error("Error in promoteUserToAdmin:", error);
        throw error;
    } finally {
        await client.close();
    }
}



router.put('/users/:userId/promote-to-admin', adminAuth, async (req, res) => {
  try {
      const userId = req.params.userId;
      console.log("Attempting to promote user with ID:", userId); // Log for debugging

      const updatedUser = await promoteUserToAdmin(userId);

      if (!updatedUser) {
          console.log("User not found or invalid userId format for ID:", userId); // Log for debugging
          return res.status(404).send('User not found or invalid userId.');
      }

      res.send({ message: 'User successfully promoted to admin.', user: updatedUser });
  } catch (error) {
      console.error('Error in promoting user:', error);
      res.status(500).send('Internal server error');
  }
});





router.put('/reviews/:reviewId/hidden', adminAuth, (req, res) => {
    const reviewId = req.params.reviewId;
    const review = db.get('reviews').get(reviewId).value();

    if (!review) {
        return res.status(404).send('Review not found.');
    }

    // Toggle the hidden status
    db.get('reviews').get(reviewId).assign({ hidden: !review.hidden }).write();
    res.send({ message: 'Review hidden status updated.', hidden: !review.hidden });
});

// In your server-side route handling
router.get('/reviews', adminAuth, async (req, res) => {
    // Fetch reviews from lowdb
    const reviews = db.get('reviews').value(); // Adjust according to your lowdb setup
    res.json(reviews);
});


// PORT
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request
