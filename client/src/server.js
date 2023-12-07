import React from 'react';
import './App.css';
import LoginForm from './LoginForm'; // Assuming you have a LoginForm component
import LoginSignup from './Components/LoginSignup';
class App extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:""};
  }

  callAPI(){
    fetch('/api/superheroes/0')
    .then(res => res.text())
    .then(res => this.setState({apiResponse: res}))
  }
  componentWillMount(){
    this.callAPI();
  }

render(){
  return (
    <div>

    <p>{this.state.apiResponse}</p>  
    </div>
  );
}
}
export default App;
