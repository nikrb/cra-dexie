import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Dexie from 'dexie';

class App extends Component {
  state = {
    name : "",
    units: "",
    foods : []
  };
  componentWillMount = () => {
    console.log( "create new database")
    this.db = new Dexie( "hellodexie6");
    this.db.version(1).stores({
      foods: "++id, [name+units]",
      lists: "created"
    });
  };
  popFoods = () => {
    const { name, units} = this.state;
    console.log( "populate foods:", name, units);
    if( name.length === 0 || units.length === 0){
      return;
    }
    this.setState( {name: ""});
    this.db.foods.add( { name: name, units: units})
    .then( ( res) => {
      console.log( "successfully put food:", res);
    })
    .catch( (e) => {
      console.error( "failed to add foods:", e);
    });
  };
  fetchFoods = () => {
    this.db.foods.toArray()
    .then( (docs) => {
      console.log( "foods fetched:", docs);
      this.setState( { foods: docs});
    })
    .catch( (e) => {
      console.error( "fetch foods failed:", e);
    });
  };
  foodNameChange = (e) => {
    this.setState( { name: e.target.value});
  };
  foodUnitsChange = (e) => {
    this.setState( {units: e.target.value});
  }
  render() {
    const foods = this.state.foods.map( (food,ndx) => <li key={ndx}>{food.name} - {food.units}</li>);
    const food_entry = {
      margin : "10px"
    };
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="container">
          <div style={food_entry}>
            <input type="text" value={this.state.name} onChange={this.foodNameChange} />
            <select value={this.state.units} onChange={this.foodUnitsChange} >
              <option value="kg">Kg</option>
              <option value="unit">Unit</option>
            </select>
            <button type="button" onClick={this.popFoods} >Add Food</button>
          </div>
          <button type="button" onClick={this.fetchFoods} >Refresh List</button>
          <h3>Food List</h3>
          <ul>
            {foods.length?foods : <li>No Foods</li>}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
