
// Get the search button and input elements from the DOM
import React, { useState, useEffect } from 'react';
import './LoginSignup.css'
import axios from 'axios';
function sanitizeString(str) {
  return str.trim().replace(/[&<>"'/]/g, function (match) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    })[match];
  });
}
function sanitizeNumber(num) {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? 0 : parsed;
}
function sanitizeArray(arr) {
  return arr.map(el => sanitizeString(el));
}


function SuperheroesDataComponent(){
  const [superheroes, setSuperheroes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
React.useEffect(() => {
  const fetchSuperhero = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/superheroes/`);
      if (res.ok) {
        const data = await res.json();
        setSuperheroes(data);
      } else {
        console.error('Failed to fetch data');
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchSuperhero();
}, []); // Empty dependency array means this runs once on component mount
/*
return (
 <div>
  /*
    {isLoading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <ul>
        {superheroes.map(hero => (
          <li key={hero.id}>{hero.name}</li>
        ))}
      </ul>
    )}
  </div>
  
);
*/
}

function SuperheroesSearch() {
  // State declarations
  const [searchTerm, setSearchTerm] = useState('');
  const [secondsearchTerm, setSecondSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [secondcategory, setSecondCategory] = useState('');
  const [displayVolume, setDisplayVolume] = useState('');
  const [searchPower, setSearchPower] = useState('');
  const [categoryOrder, setCategoryOrder] = useState('');
  const [results, setResults] = useState([]);
  const [selectedSuperheroId, setSelectedSuperheroId] = useState(null);
  const [error, setError] = useState(null);

console.log(category)  

const handleSuperheroSelect = (results) => {
  setSelectedSuperheroId(results);
};

  const searchSuperheroes = () => {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const encodedCategory = encodeURIComponent(category);
    const encodedDisplayVolume = encodeURIComponent(displayVolume);
    const encodedsecondsearchTerm = encodeURIComponent(secondsearchTerm);
    const encodedsecondcategory = encodeURIComponent(secondcategory);
console.log(category);


        let url = '';
    if (category === 'power') {
      const encodedSearchPower = encodeURIComponent(searchPower);
      url = `http://localhost:4000/api/superheroes/search/power?power=${encodedSearchTerm}&second=${encodedsecondcategory}&pattern=${encodedsecondsearchTerm}&n=${encodedDisplayVolume}`;
    } else if (category === 'ids') {
      const encodedConverter = encodeURIComponent(parseInt(searchTerm, 10));
      url = `http://localhost:4000/api/superheroes/${encodedConverter}/powers`;
    } else{
      url = `http://localhost:4000/api/superheroes/search?field=${category}&second=${encodedsecondcategory}&pattern=${encodedSearchTerm}&secondpattern=${secondsearchTerm}&n=${encodedDisplayVolume}`;
      console.log(url = `http://localhost:4000/api/superheroes/search?field=${category}&second=${encodedsecondcategory}&pattern=${encodedSearchTerm}&secondpattern=${secondsearchTerm}&n=${encodedDisplayVolume}`);
    }
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResults(data); // Assuming the data structure has a superheroes field
      })
      .catch(error => {
        setError(error.message);
      });
  };
  console.log(results)
  return (
    <div>
      <input  
        type="text" 
        value={searchTerm} 
        
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search Superheroes"
      />
      <input 
        type="text" 
        value={secondsearchTerm} 
        onChange={(e) => setSecondSearchTerm(e.target.value)} 
        placeholder="Second Superhero Search"
      />
      <input 
        type="number" 
        value={displayVolume} 
        onChange={(e) => setDisplayVolume(e.target.value)} 
        placeholder="Input Number Of Terms"
      />
   <select 
  value={category} 
  onChange={(e) => {
    console.log("Category selected:", e.target.value);
    setCategory(e.target.value);
  }}>
    <option value=""></option>
  <option value="name">Name</option>
  <option value="Race">Race</option>
  <option value="power">Power</option>
  <option value="Publisher">Publisher</option>
</select>

<select 
  value={secondcategory} 
  onChange={(e) => {
    console.log("Category selected:", e.target.value);
    setSecondCategory(e.target.value);
  }}>
    <option value=""></option>
  <option value="name">Name</option>
  <option value="Race">Race</option>
  <option value="power">Power</option>
  <option value="Publisher">Publisher</option>
</select>

      <button onClick={searchSuperheroes}>Search</button>
    
      {error && <p>Error: {error}</p>}

      <div id="results">
        {results && results.map(superhero => (
          <div key={superhero.id}>
            <p> 
              Name: {superhero.name} Publisher: {superhero.Publisher}
              <button onClick={() => handleSuperheroSelect(superhero.id)}>Extend</button>
            </p>
            
            {selectedSuperheroId === superhero.id && (category==="name" || category==="Race" || category==="Publisher")&&
              <div>
                <p>Gender: {superhero.Gender}</p>
                <p>Eye Color: {superhero["Eye color"]}</p>
                <p>race: {superhero.Race}</p>
                <p>Hair: {superhero["Hair color"]}</p>
                <p>Height: {superhero.Height}</p>
                <p>Publisher:{superhero.Publisher}</p>
                <p>Skin: {superhero["Skin color"]}</p>
                <p>Alignment: {superhero.Alignment}</p>
                <p>Weight: {superhero.Weight}</p>
              </div>
            }
            {selectedSuperheroId === superhero.id && category==="power" &&
              <div>
                <p>Gender: {superhero.Gender}</p>
                <p>Eye Color: {superhero.Eye}</p>
                <p>race: {superhero.Race}</p>
                <p>Hair: {superhero.Hair}</p>
                <p>Height: {superhero.Height}</p>
                <p>Publisher:{superhero.Publisher}</p>
                <p>Skin: {superhero.Skin}</p>
                <p>Alignment: {superhero.Alignment}</p>
                <p>Weight: {superhero.Weight}</p>
                <p>Powers:{superhero.powers}</p>
              </div>
            }
          </div>
        ))}
        
      </div>

    </div>
  );      
}





function SuperheroList() {
  const [superheroIdsInput, setSuperheroIdsInput] = useState('');
  const [listName, setListName] = useState('');

  const pushSuperheroList = () => {
    let superheroIds = superheroIdsInput.split(',').map(id => id.trim());
    console.log('Creating list:', listName, 'with superheroes:', superheroIds);
    // API request or other actions would go here
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter superhero IDs"
        value={superheroIdsInput}
        onChange={(e) => setSuperheroIdsInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter list name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <button onClick={pushSuperheroList}>Create Superhero List</button>
    </div>
  );
}
function HeroLists() {
  const [lists, setLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null); // Track expanded list for basic details
  const [fullDetailsList, setFullDetailsList] = useState(null); // Track expanded list for full details

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        setLists(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExpandClick = (listName) => {
    setExpandedList(expandedList === listName ? null : listName);
    // Collapse full details if the same list is expanded/collapsed
    if (fullDetailsList === listName) {
      setFullDetailsList(null);
    }
  };

  const handleFullDetailsClick = (listName) => {
    setFullDetailsList(fullDetailsList === listName ? null : listName);
    // Collapse basic details if the same list is expanded/collapsed
    if (expandedList === listName) {
      setExpandedList(null);
    }
  };

  return (
    <div>
      <h1>Public Hero Lists</h1>
      <ul>
        {lists.map(list => (
          <li key={list.name}>
            <h2>{list.name}</h2>
            <button onClick={() => handleExpandClick(list.name)}>
              {expandedList === list.name ? 'Hide Details' : 'Show Details'}
            </button>
            <button onClick={() => handleFullDetailsClick(list.name)}>
              {fullDetailsList === list.name ? 'Hide All Info' : 'Show All Info'}
            </button>
            <p>Description: {list.description || 'No description available'}</p>
            <p>Visibility: {list.visibility.charAt(0).toUpperCase() + list.visibility.slice(1)}</p>
            <p>Number of Heroes: {list.superheroes.length}</p>
            <p>Average Rating: {list.averageRating.toFixed(1)}</p>
            <p>Last Modified: {new Date(list.lastModified).toLocaleDateString()}</p>
            {expandedList === list.name && (
              <div>
                {list.superheroes.map((hero, index) => (
                  <div key={index}>
                    <p>Name: {hero.name}</p>
                    <p>Power: {hero.powers.join(', ')}</p>
                    <p>Publisher: {hero.Publisher}</p>
                  </div>
                ))}
              </div>
            )}
            {fullDetailsList === list.name && (
              <div>
                {list.superheroes.map((hero, index) => (
                  <div key={index}>
                    <p>Gender: {hero.gender}</p>
                    <p>Eye Color: {hero.Eye_Color}</p>
                    <p>Race: {hero.race}</p>
                    <p>Hair: {hero.Hair}</p>
                    <p>Height: {hero.Height}</p>
                    <p>Publisher: {hero.Publisher}</p>
                    <p>Skin: {hero.Skin}</p>
                    <p>Alignment: {hero.Alignment}</p>
                    <p>Weight: {hero.Weight}</p>
                    <p>Powers: {hero.powers.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



function ListForm() {
  const [listName, setListName] = useState('');
  const [superheroIds, setSuperheroIds] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idsArray = superheroIds.split(',').map(id => parseInt(id.trim(), 10));

    try {
      const response = await axios.post(`http://localhost:4000/api/lists/${listName}`, {
        superheroIds: idsArray,
        description,
        visibility
      });
      console.log(response.data);
      alert('List updated successfully!');
    } catch (error) {
      console.error('Error updating list:', error);
      alert('Error updating list.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="List Name"
        required
      />
      <input
        type="text"
        value={superheroIds}
        onChange={(e) => setSuperheroIds(e.target.value)}
        placeholder="Superhero IDs (comma-separated)"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
      <button type="submit">Create/Update List</button>
    </form>
  );
}


function ListResults() {
  const [listReturn, setListReturn] = useState('');
  const [listSorter, setListSorter] = useState('ascending');
  const [attributeOrder, setAttributeOrder] = useState('');
  const [listObj, setListObj] = useState('GetList'); // Set a default value if needed
  const [superheroes, setSuperheroes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState('');

  const GetList= async () =>{

  useEffect(() => {
    if (listObj === "GetList") {
    const fetchData = async () => {
        setIsLoading(true);
        const encodedReturn = encodeURIComponent(listReturn);
        try {
          const response = await fetch(`http://localhost:4000/api/lists/${encodedReturn}`);
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          const data = await response.json();
          const sortOrderMultiplier = listSorter === 'ascending' ? 1 : -1;
          if (data.superheroes && Array.isArray(data.superheroes)) {
            if (attributeOrder === 'power') {
              data.superheroes.sort((a, b) => {
                const powersA = Array.isArray(a.powers) ? a.powers.length : 0;
                const powersB = Array.isArray(b.powers) ? b.powers.length : 0;
                return (powersA - powersB) * sortOrderMultiplier;
              });
            } else {
              data.superheroes.sort((a, b) => {
                return (a[attributeOrder] || '').localeCompare(b[attributeOrder] || '', undefined, { numeric: true }) * sortOrderMultiplier;
              });
            }
          }
          setSuperheroes(data.superheroes);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [listReturn, listSorter, attributeOrder, listObj]);
  }
      const handleDelete = async () => {
        const encodedReturn = encodeURIComponent(listReturn);
        const fetchList = {
          method: 'DELETE',
        };
    
        fetch(`http://localhost:4000/api/lists/${encodedReturn}`, fetchList)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json(); // Assuming the API always returns JSON
          })
          .then(data => {
            setDeleteStatus('List deleted successfully');
            console.log('Delete response:', data);
          })
          .catch(error => {
            console.error('Fetch error:', error);
            setError(error.message); // Now setError is defined
          });
    
    }
  return (
    <div>
      <input type="text" value={listReturn} onChange={e => setListReturn(e.target.value)} placeholder='Enter List Name'/>
      <button onClick={GetList}>Get List</button> {/* Corrected onClick handler */}
      <button onClick={handleDelete}>Delete List</button> {/* Corrected onClick handler */}
      {deleteStatus && <p>{deleteStatus}</p>}
      {error && <p>Error: {error}</p>} {/* Display error message if exists */}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {superheroes.map(hero => (
            <li key={hero.id}>
              Name: {hero.name} {/* Render other superhero details if needed */}
            </li>
          ))}
        </ul>
      )}
    
    </div>
    
  );

}



function DisplayResults() {
  const [superheroes, setSuperheroes] = useState([]);

  const sortAndDisplayResults = (heroes, direction, field) => {
    const sortOrderMultiplier = direction === 'ascending' ? 1 : -1;
  
    const sortedHeroes = [...heroes].sort((a, b) => {
      if (field === 'power') {
        const powersA = Array.isArray(a.powers) ? a.powers.length : 0;
        const powersB = Array.isArray(b.powers) ? b.powers.length : 0;
        return (powersA - powersB) * sortOrderMultiplier;
      } else {
        const valueA = a[field] || '';
        const valueB = b[field] || '';
        return valueA.localeCompare(valueB, undefined, { numeric: true }) * sortOrderMultiplier;
      }
    });
  
    setSuperheroes(sortedHeroes);
    return (
      <div id="results">
        {superheroes.map((superhero, index) => (
          <div key={index}>
            {/* Render superhero details */}
          </div>
        ))}
      </div>
    );
  };
}

function GetAllPublishersComponent() {
  const [publishers, setPublishers] = useState([]);
  const [error, setError] = useState(null);
  const fetchPublishers = () => {
    fetch(`http://localhost:4000/api/superheroes/publishers`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPublishers(data); // Assuming 'data' is the array of publishers
      })
      .catch(error => {
        setError(error.message);
      });
      return (
        <div>
          <button onClick={fetchPublishers}>Show Publishers</button>
      
          {error && <p>Error: {error}</p>}
      
          <div id="results">
            {publishers.map((publisher, index) => (
              <div key={index}>
                Publisher: {publisher}
              </div>
            ))}
          </div>
        </div>
      );
  };
}

export { SuperheroesSearch, ListResults, SuperheroesDataComponent, SuperheroList, DisplayResults, GetAllPublishersComponent,ListForm, HeroLists};


/*
const handleSearchClick = () => {
 // Get the current value of the input and select elements
 const displayn = sanitizeNumber(displayvolume.toLowerCase());
 const searchTerm = sanitizeString(sea.value.toLowerCase());
 const searchpower = sanitizeString(searchTermInput.value);
 const category = categorySelect.value;
 const catsorter = categoryorder.value;
 const displayvolume = parseInt(displayn);
 console.log(searchTerm, category, displayvolume, searchpower); // Log the search term and category for debugging

 // Call the search function with the current search term and category
 searchSuperheroes(searchTerm, category, displayvolume, searchpower, catsorter);
  };
  
  const handleSubmitList = () => {
    const listVal = listName.value;
    const ids = superhero_ids.value.split(',').map(id => parseInt(id.trim(), 10)); // Convert string of IDs into an array of numbers
    createSuperheroList(listVal, ids);
    console.log(ids)
  };
  
  const handleListReturn = () => {
    const listreturnsi = sanitizeString(listreturn.value);
    const listsorter = listorder.value;
    const attributeorder = attributeSelect.value;
    const list_obj= list_objective.value;
    getSuperheroList(listreturnsi, listsorter, attributeorder, list_obj);
  };
  */

  /*
const [searchTerm, setSearchTerm] = useState('');//searchTermInput
const [category, setCategory] = useState('');//categorySelect
const [displayVolume, setDisplayVolume] = useState('');//displayvol
const [listName, setListName] = useState('');//listName
const [superheroIds, setSuperheroIds] = useState('');//superhero_ids
const [listReturn, setListReturn] = useState('');//listreturn
const [categoryOrder, setCategoryOrder] = useState('');//categoryorder
const [listOrder, setListOrder] = useState('');//listorder
const [listObjective, setListObjective] = useState('');//list_objective
const [attribute, setAttribute] = useState('');//attributeSelect
const [results, setResults] = useState([]);//div id for showing the content provided
const [superheroes, setSuperheroes] = React.useState([]);
const [isLoading, setIsLoading] = React.useState(false);
const [error, setError] = React.useState(null);
const [deleteStatus, setDeleteStatus] = React.useState('');
const [searchPower, setSearchPower] = React.useState('');
const [publishers, setPublishers] = React.useState([]);
const searchButton = document.getElementById("submit");
const submitlistButton = document.getElementById("submitlist");
const searchTermInput = document.getElementById("searchTerm");
const showpublishers = document.getElementById('submitpublishers');
*/

/*
    const fetchList = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listName }) // Assuming the server expects an object with a key 'listName'
    };
//input Sanitization before fetching
    fetch('/api/lists', fetchList)
      .then(response => {
        if (!response.ok) {
            herocontent.innerHTML='List Exists';
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse JSON response into JavaScript object
      })
      .then(data => {
        herocontent.innerHTML='List Created';
        console.log('List created:', data); // Handle the response data
  
        // Now, add superhero IDs to the list
        const fetchIDs = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({superheroIds}) // Assuming the server expects an object with a key 'superhero_ids'
        };
  console.log(JSON.stringify(superheroIds ));
//input Sanitization before fetching
  
const encodedlistName = encodeURIComponent(listName);
        return fetch(`/api/lists/${encodedlistName}`, fetchIDs); // Adjust the endpoint as per your API
      })
      .then(response => {
        if (!response.ok) {  
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Superhero IDs added:', data); // Handle the response data
        // Fetch the updated list
      });
  }
  */
 /* <select 
  value={category} 
  onChange={(e) => setCategory(e.target.value)}>
  <option value="">Select Category</option>

function MyComponent() {
  const [superheroIdsInput, setSuperheroIdsInput] = useState('');

  const handleSuperheroIdsChange = (e) => {
    setSuperheroIdsInput(e.target.value);
  };

  return (
    <input type="text" value={superheroIdsInput} onChange={handleSuperheroIdsChange} />
  );
}


  */
