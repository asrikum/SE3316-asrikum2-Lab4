
// Get the search button and input elements from the DOM
import React, { useState, useEffect } from 'react';
import './LoginSignup.css'
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
      url = `${process.env.REACT_APP_API_BASE_URL}/api/superheroes/search/power?power=${encodedSearchTerm}&second=${encodedsecondcategory}&pattern=${encodedsecondsearchTerm}&n=${encodedDisplayVolume}`;
    } else if (category === 'ids') {
      const encodedConverter = encodeURIComponent(parseInt(searchTerm, 10));
      url = `${process.env.REACT_APP_API_BASE_URL}/api/superheroes/${encodedConverter}/powers`;
    } else{
      url = `${process.env.REACT_APP_API_BASE_URL}/api/superheroes/search?field=${category}&second=${encodedsecondcategory}&pattern=${encodedSearchTerm}&secondpattern=${secondsearchTerm}&n=${encodedDisplayVolume}`;
      console.log(url = `${process.env.REACT_APP_API_BASE_URL}/api/superheroes/search?field=${category}&second=${encodedsecondcategory}&pattern=${encodedSearchTerm}&secondpattern=${secondsearchTerm}&n=${encodedDisplayVolume}`);
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
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lists/${encodedReturn}`);
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
    
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/lists/${encodedReturn}`, fetchList)
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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/superheroes/publishers`)
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

export { SuperheroesSearch, ListResults, SuperheroesDataComponent, SuperheroList, DisplayResults, GetAllPublishersComponent};
