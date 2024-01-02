
// Get the search button and input elements from the DOM
import React, { useState, useEffect } from 'react';

import './LoginSignup.css'
import axios from 'axios';
import { Await } from 'react-router-dom';
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

const handleDDGSearch = (heroName) => {
  const query = encodeURIComponent(heroName);
  window.open(`https://duckduckgo.com/?q=${query}`, '_blank');
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
              <button onClick={() => handleDDGSearch(superhero.name)}>Search on DDG</button>
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
  const [expandedList, setExpandedList] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        console.log("Fetched lists:", response.data);
        const privateLists = response.data.filter(list => list.visibility === 'public');
        setLists(privateLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExpandClick = (listName) => {
    if (expandedList === listName) {
      setExpandedList(null);
    } else {
      setExpandedList(listName);
    }
  };

  return (
    <div>
      <h1>Private Hero Lists</h1>
      <ul>
        {lists.slice(0, displayLimit).map(list => (
          <li key={list.name}>
            <h2>{list.name}</h2>
            <button onClick={() => handleExpandClick(list.name)}>
              {expandedList === list.name ? 'Hide Details' : 'Show Details'}
            </button>
            <p>Description: {list.description || 'No description available'}</p>
            <p>Visibility: {list.visibility.charAt(0).toUpperCase() + list.visibility.slice(1)}</p>
            <p>Number of Heroes: {list.superheroes.length}</p>
            <p>Average Rating: {list.averageRating.toFixed(1)}</p>
            <p>Last Modified: {new Date(list.lastModified).toLocaleDateString()}</p>
            {expandedList === list.name && (
              <div>
                <div>
                  {list.superheroes.map((hero, index) => (
                    <div key={index}>
                      <p>Name: {hero.name}</p>
                      <p>Power: {hero.powers.join(', ')}</p>
                      <p>Publisher: {hero.publisher}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3>Reviews:</h3>
                  {list.reviews && list.reviews.length > 0 ? (
                    list.reviews.map((review, index) => (
                      <div key={index}>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {displayLimit < lists.length && (
        <button onClick={() => setDisplayLimit(prevLimit => prevLimit + 10)}>
          Load More
        </button>
      )}
    </div>
  );
}



function Private() {
  const [lists, setLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        console.log("Fetched lists:", response.data);
        const privateLists = response.data.filter(list => list.visibility === 'public'||'private');
        setLists(privateLists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExpandClick = (listName) => {
    if (expandedList === listName) {
      setExpandedList(null);
    } else {
      setExpandedList(listName);
    }
  };

  return (
    <div>
      <h1>Private Hero Lists</h1>
      <ul>
        {lists.slice(0, displayLimit).map(list => (
          <li key={list.name}>
            <h2>{list.name}</h2>
            <button onClick={() => handleExpandClick(list.name)}>
              {expandedList === list.name ? 'Hide Details' : 'Show Details'}
            </button>
            <p>Description: {list.description || 'No description available'}</p>
            <p>Visibility: {list.visibility.charAt(0).toUpperCase() + list.visibility.slice(1)}</p>
            <p>Number of Heroes: {list.superheroes.length}</p>
            <p>Average Rating: {list.averageRating.toFixed(1)}</p>
            <p>Last Modified: {new Date(list.lastModified).toLocaleDateString()}</p>
            {expandedList === list.name && (
              <div>
                <div>
                  {list.superheroes.map((hero, index) => (
                    <div key={index}>
                      <p>Name: {hero.name}</p>
                      <p>Power: {hero.powers.join(', ')}</p>
                      <p>Publisher: {hero.publisher}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3>Reviews:</h3>
                  {list.reviews && list.reviews.length > 0 ? (
                    list.reviews.map((review, index) => (
                      <div key={index}>
                        <p>Rating: {review.rating}</p>
                        <p>Comment: {review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {displayLimit < lists.length && (
        <button onClick={() => setDisplayLimit(prevLimit => prevLimit + 10)}>
          Load More
        </button>
      )}
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

const EditListForm = () => {
  const [lists, setLists] = useState([]); // All available lists
  const [selectedList, setSelectedList] = useState(''); // Currently selected list for editing
  const [superheroes, setSuperheroes] = useState([]); // IDs of superheroes in the list
  const [description, setDescription] = useState(''); // Description of the list
  const [visibility, setVisibility] = useState('private'); // Visibility of the list

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        setLists(response.data); // Assuming the response contains a list of list names
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    // Fetch the details of the selected list
    const fetchListDetails = async () => {
      if (selectedList) {
        try {
          const response = await axios.get(`http://localhost:4000/api/lists/${selectedList}`);
          const listDetails = response.data;
          setSuperheroes(listDetails.superheroes.join(', ')); // Assuming the superheroes are in an array
          setDescription(listDetails.description);
          setVisibility(listDetails.visibility);
        } catch (error) {
          console.error('Error fetching list details:', error);
        }
      }
    };
    fetchListDetails();
  }, [selectedList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const superheroesArray = superheroes.split(',').map(id => parseInt(id.trim(), 10)); // Convert to array of integers

    try {
      const response = await axios.put(`http://localhost:4000/api/lists/${selectedList}`, {
        superheroes: superheroesArray,
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
    <div>
      <h3>Edit a List</h3>
      <select onChange={(e) => setSelectedList(e.target.value)} value={selectedList}>
        <option value="">Select a List</option>
        {lists.map(list => (
          <option key={list.name} value={list.name}>{list.name}</option>
        ))}
      </select>

      {selectedList && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={superheroes}
            onChange={(e) => setSuperheroes(e.target.value)}
            placeholder="Superhero IDs (comma-separated)"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
          <button type="submit">Update List</button>
        </form>
      )}
    </div>
  );
};

function DeleteListForm() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        const privateLists = response.data.filter(list => list.visibility === 'private');
        setLists(privateLists);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  const handleDelete = async () => {
    if (!selectedList) {
      setMessage('Please select a list to delete.');
      return;
    }
    
    try {
      await axios.delete(`http://localhost:4000/api/lists/${selectedList}`);
      setMessage('List deleted successfully!');
      setSelectedList(''); // Reset selected list after deletion
      // Optional: refresh the list of lists
      // fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
      setMessage('Failed to delete list. Please try again.');
    }
  };

  return (
    <div>
      <h3>Delete a List</h3>
      {message && <p>{message}</p>}
      <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
        <option value="">Select a List</option>
        {lists.map(list => (
          <option key={list.name} value={list.name}>{list.name}</option>
        ))}
      </select>
      <button onClick={handleDelete}>Delete List</button>
    </div>
  );
}



const ReviewForm = () => {
  const [lists, setLists] = useState([]); // All available lists as an array
  const [selectedList, setSelectedList] = useState(''); // Currently selected list for review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all lists when the component mounts
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/lists');
        const listsData = response.data; // Adjust this based on your actual response structure
        const publicLists = listsData.filter(list => list.visibility === 'public');
        setLists(publicLists);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/api/lists/${selectedList}/reviews`, {
        rating,
        comment
      });
      setMessage('Review added successfully!');
      setRating(0);
      setComment('');
    } catch (error) {
      setMessage('Failed to add review. Please try again.');
    }
  };

  return (
    <div>
      <h3>Add a Review to a List</h3>
      {message && <p>{message}</p>}

      <select onChange={(e) => setSelectedList(e.target.value)} value={selectedList}>
        <option value="">Select a List</option>
        {lists.map((list) => (
          <option key={list.name} value={list.name}>{list.name}</option>
        ))}
      </select>

      {selectedList && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Rating:
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};




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

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selecteddisabledId, setSelecteddisableId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
    const [selectedReviewId, setSelectedReviewId] = useState('');


  useEffect(() => {
      fetchUserData();
      fetchReviews();
  }, []);


  
  const fetchUserData = async () => {
    try {
      setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const response = await axios.get("http://localhost:4000/admin/users", config);
        setUsers(response.data);
        setLoading(false);
        console.log(response.data); // Process the response data as needed
    } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        // Handle errors (e.g., token expired, unauthorized access)
    }
};

const handleUserSelect = (event) => {
  setSelectedUserId(event.target.value);
};

const toggleManagerStatus = async () => {
  if (!selectedUserId) return;

  try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      };

      await axios.put(`http://localhost:4000/admin/users/${selectedUserId}/promote-to-admin`, {}, config);
      setUsers(users.map(user => user._id === selectedUserId ? { ...user, isManager: !user.isManager } : user));
      setLoading(false);
    
  } catch (error) {
      alert("Error updating Admin status", error);
      setError('Failed to update Admin status');
      setLoading(false);
  }
  alert("Admin changed Successfully!");
};


const handleUserDisable = (event) => {
  setSelecteddisableId(event.target.value);
};

const toggleDisableStatus = async () => {
  if (!selecteddisabledId) return;

  try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      };

      await axios.put(`http://localhost:4000/admin/users/${selecteddisabledId}/disable`, {}, config);
      setUsers(users.map(user => user._id === selectedUserId ? { ...user, disabled: !user.disabled } : user));
      setLoading(false);
  } catch (error) {
      console.error("Error updating disabled status", error);
      setError('Failed to update disabled status');
      setLoading(false);
  }
  alert("Disabled User Successfully!");
};

const handleAdminReview = (event) => {
  setSelectedReviewId(event.target.value);
};

const fetchReviews = async () => {
  try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/reviews');
      setReviews(response.data); // Assuming response.data is now an array of reviews with ids
      setLoading(false);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews');
      setLoading(false);
  }
  
};





const toggleReviewHiddenStatus = async () => {
  if (!selectedReviewId) return;

  try {
      const config = {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
      };
      await axios.put(`http://localhost:4000/api/reviews/${selectedReviewId}/hidden`, {}, config);
      setLoading(false);
      fetchReviews(); // Re-fetch reviews to update the UI
  } catch (error) {
      console.error('Error updating review hidden status', error);
  }
  alert("Hidden Reviews Successfully!");
};
  return (
      <div>
          <h1>Admin Dashboard</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? <p>Loading...</p> : (
              <>
                  <h2>Users</h2>
                  <select value={selectedUserId} onChange={handleUserSelect}>
                      <option value="">Select a User</option>
                      {users.map(user => (
                          <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                      ))}
                  </select>
                  <button onClick={toggleManagerStatus}>Change Admin Status</button>
              </>
          )}

<>
                  <h2>Disable Users</h2>
                  <select value={selecteddisabledId} onChange={handleUserDisable}>
                      <option value="">Select a User</option>
                      {users.map(user => (
                          <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                      ))}
                  </select>
                  <button onClick={toggleDisableStatus}>Change Disable Status</button>
              </>
              <h1> Reviews</h1>
              <select value={selectedReviewId} onChange={handleAdminReview}>
    <option value="">Select a Review</option>
    {reviews.map(review => (
        <option key={review.id} value={review.id}>
            {review.id} - {review.comment || 'No Comment'}
        </option>
    ))}
</select>


<button onClick={toggleReviewHiddenStatus}>Change Hidden Status</button>
      </div>
  );
};

export { SuperheroesSearch, ListResults, SuperheroesDataComponent, SuperheroList, DisplayResults, GetAllPublishersComponent, ListForm, HeroLists, EditListForm, ReviewForm, DeleteListForm, AdminDashboard, Private};


