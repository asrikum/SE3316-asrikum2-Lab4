const express = require('express');
const cors = require('cors');
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
        gender: sh.Gender,
        Eye_Color: sh["Eye color"],
        race: sh.Race,
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
  const regex = new RegExp(pattern, 'i');
  
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
      listName: listName
      
  });
}catch (error) {
    // If there's an error, send a 500 response
    res.status(500).send('Server error');
  }
});

app.post('/api/lists/:listName', async (req, res) => {
  // Extract the list name from the URL parameters
  const { listName } = req.params;

  // Extract the superhero IDs from the request body
  const { superheroIds } = req.body;

  // Check if the list name already exists
  const listExists = db.has(`lists.${listName}`).value();

  if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
  }

  // Check if the superhero IDs are provided and are in an array
  if (!Array.isArray(superheroIds)) {
      return res.status(400).send('Superhero IDs must be an array.');
  }

  // Add superhero IDs to the existing list
  const updatedList = [...superheroIds];
  const uniqueElementsSet = new Set(updatedList);
const numberOfUniqueElements = uniqueElementsSet.size;
console.log(uniqueElementsSet);
const uniqueElementsArray = Array.from(uniqueElementsSet);
for(let i =0; i< numberOfUniqueElements; i++){
const listheroes = uniqueElementsArray[i];  
console.log(listheroes);
 const superhero = superhero_pub.find(sh => sh.id === listheroes);
  console.log(superhero);
};
  // Update the list in the database
  db.set(`lists.${listName}`, updatedList).write();

  // Return the updated list
  res.status(200).json({
      message: 'Superhero IDs added to the list successfully.',
      list: updatedList
  });
});

app.get('/api/lists/:listName', async (req, res) => {
  try {
    // Extract the listName from the request parameters
    const { listName } = req.params;

    // Check if the list name exists in the database
    const listExists = db.has(`lists.${listName}`).value();

    if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
    }
    // Retrieve the current list from the database
    const currentList = db.get(`lists.${listName}`).value();
    let superheroDetails = [];
    const uniqueElementsSet = new Set(currentList);
    const numberOfUniqueElements = uniqueElementsSet.size;
    console.log(uniqueElementsSet);
    const uniqueElementsArray = Array.from(uniqueElementsSet);
    let superheroarray = [];
    let superheroespowers= [];
    for(let i =0; i< numberOfUniqueElements; i++){
    const listheroes = uniqueElementsArray[i];  
    console.log(listheroes);
    const superhero = superhero_pub.find(sh => sh.id === listheroes);
    superheroarray.push(superhero);
  }
  for (let heroId of currentList) {
    const superhero = superhero_pub.find(sh => sh.id === heroId);

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
          id: heroId,
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
          id: heroId,
          name: superhero.name,
          gender: superhero.Gender,
          Eye_Color: eyeColor,
          race:superhero.Race,
          Hair:superhero.Hair,
          Height: superhero.Height,
          Publisher:superhero.Publisher,
          Skin: skin,
          Alignment:superhero.Alignment,
          Weight: superhero.Weight,
          powers: [] // No powers found
        });
      }
    }
  }

  res.status(200).json({
    message: 'Superhero details fetched successfully.',
    superheroes: superheroDetails
  });

} catch (error) {
  console.error('Server error:', error);
  res.status(500).send('Server error');
}
});

app.delete('/api/lists/:listName', (req, res) => {
  try {
    // Extract the listName from the request parameters
    const { listName } = req.params;

    // Check if the list name exists in the database
    const listExists = db.has(`lists.${listName}`).value();

    if (!listExists) {
      // If the list name does not exist, return an error
      return res.status(404).send('List name does not exist.');
    }
    db.unset(`lists.${listName}`).write();

    // Send a success response
    res.status(200).send('List deleted successfully.');
} catch (error) {
  // If there's an error, log it and send a 500 response
  console.error('Server error:', error);
  res.status(500).send('Server error');
}
  
});

// PORT
const port = process.env.PORT || 4000;// sets an arbritrary port value instead of 3000 as 3000 is more likely to be busy 
app.listen(port, () => console.log(`Listening on port ${port}...`));// sends to local port
// the / represents the connection to the site(Path or Url), response and request

//hi
