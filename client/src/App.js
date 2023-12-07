/*import React from 'react';
import './App.css';
import LoginForm from './LoginForm'; // Assuming you have a LoginForm component
import LoginSignup from './Components/LoginSignup';
import { 
  ListResults, 
  SuperheroesDataComponent, 
  SuperheroList, 
  SuperheroesSearch, 
  DisplayResults, 
  GetAllPublishersComponent 
} from './Components/searchsuper';

function App() {
  return (
    <div>
      <SuperheroesSearch/>
      <SuperheroesDataComponent/>
      <SuperheroList/>
      <ListResults/>
      <GetAllPublishersComponent/>
      <DisplayResults/>
    </div>
  );
}

export default App;
*/
import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./loginbase/client/Main";
import Signup from "./loginbase/client/Signup";
import Login from "./loginbase/client/Login";
import EmailVerify from "./loginbase/client/EmailVerify";

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/users/:id/verify/:token" element={<EmailVerify />} />
		</Routes>
	);
}

export default App;