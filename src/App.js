import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class MadLibs extends Component {
  render() {
    var name = this.props.inputs[0].value
    var friend = this.props.inputs[1].value
    var restaurant = this.props.inputs[2].value
    var celebrity = this.props.inputs[3].value
    var food = this.props.inputs[4].value
    var calories = Math.floor(this.props.foodInfo.calories)
    var servingSize = this.props.foodInfo.servingSize
    var servingUnit = this.props.foodInfo.servingUnit

    return (
      <div>
        <div>
          <p>
            You and your homie {friend}, are chilling at your favorite place {restaurant}. You order a {food} and sit down at a table.
          ‘Yo did you know that has {calories} calories per {servingSize} {servingUnit} ?’ {friend} says
            ‘That's oddly specific,' you smirk, 'Anyways I don’t care about calories. It’s like my grandmother always used to say '{this.props.quotes[0].quote}'
        </p>
        </div>
        <div>
          <p>
            Suddenly, {celebrity} walks in to {restaurant}.
          'Oh my goodness {name},' {friend} says, 'am I imagining things or is that {celebrity}?'
          You and your friend move closer and start to overhear {celebrity}'s conversation with {restaurant} worker.
          'Sometimes, I loose faith in myself,' {celebrity} says to the woman, 'In those moments, I think to myself, '{this.props.quotes[1].quote}' and it really gets me going again!'
          </p>
        </div>
      </div>
    )
  }


}

class InputOptions extends Component {

  render() {
    return (
      this.props.inputs.map((e, i) => {
        return (
          <div>
            <label>{e.label} </label>
            <input name={e.label} placeholder={e.label} key={i} onChange={this.props.handleInputChange} />
          </div>
        )
      }
      )
    )
  }
}


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputs: [
        { label: 'Your Name', },
        { label: 'Name of a Friend', },
        { label: 'Resaurant', },
        { label: 'Celebrity', },
        { label: 'Food', },
      ],
      quotes: [
        { quote: '' },
        { quote: '' },
        { quote: '' },
        { quote: '' },
        { quote: '' },
        { quote: '' },
      ],
      foodInfo: {
        calories: '',
        servingSize: '',
        servingUnit: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClick = this.handleClick.bind(this)

  }


  componentWillMount() {
    axios({
      method: 'get',
      url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=10',
      headers: { 'X-Mashape-Key': process.env.REACT_APP_KEY },
    })
      .then(response => this.setState({
        quotes: response.data,
      })
      )
  }

  handleClick() {
    axios({
      method: 'get',
      url: 'https://nutritionix-api.p.mashape.com/v1_1/search/' + this.state.inputs[4].value + '?fields=nf_calories%2Cnf_serving_size_qty%2Cnf_serving_size_unit',
      headers: { 'X-Mashape-Key': 'WKq2QQHxgymsh6gCFbBhuUSEqA8Rp1Abq9XjsnbkTTjFDcnsWu' },
    })
      .then(response => this.setState({
        foodInfo: {
          calories: response.data.hits[0].fields.nf_calories,
          servingSize: response.data.hits[0].fields.nf_serving_size_qty,
          servingUnit: response.data.hits[0].fields.nf_serving_size_unit,
        }
      })
      )

  }

  handleInputChange(e) {
    var copyInputs = this.state.inputs.slice()
    var index = copyInputs.findIndex(obj => obj.label.includes(e.target.name))
    var updatedInput = {
      label: e.target.name,
      value: e.target.value,
    }
    copyInputs.splice(index, 1, updatedInput)

    this.setState({
      inputs: copyInputs,
    })
  }


  render() {
    return (
      <div class='container'>
        <h1>Madlibs</h1>
        <p>Enter one word per category</p>
        <InputOptions
          inputs={this.state.inputs}
          handleInputChange={this.handleInputChange}
        />
        <button onClick={this.handleClick}>Show me Madlibs!</button>
        <div>
          <MadLibs
            inputs={this.state.inputs}
            quotes={this.state.quotes}
            foodInfo={this.state.foodInfo}
          />
        </div>
      </div>
    );
  }
}

export default App;
