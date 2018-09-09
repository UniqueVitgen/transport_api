import React, { Component } from 'react';
import axios from 'axios';
import {Button, Col, Jumbotron} from "react-bootstrap";

class Home extends Component {

    currentWeather;
    constructor(props) {
        super(props);
        this.getCurrentWeather();

        this.state = {
            weatherLoaded: false
        }
    }

    getCurrentWeather() {
        const self = this;

            axios.get('https://api.openweathermap.org/data/2.5/weather?q=London&APPID=d46c1e8f5133268566fbfc7c2415d5ac&units=metric')
                .then(response =>
                    {
                        console.log(response);
                        self.currentWeather = response.data;
                        self.setState({
                            weatherLoaded: true
                        })
                        // self.setState({requestCompleted: true})
                    }
                );
    }

    renderCurrentWether() {

        return (<Jumbotron>
            <h1>{this.currentWeather.name}</h1>
            <p>
                <img src={'weather/' + this.currentWeather.weather[0].main + '.png'}/>{this.currentWeather.main.temp} °C
            </p>
            {/*<p>*/}
                {/*<Button bsStyle="primary">Learn more</Button>*/}
            {/*</p>*/}
        </Jumbotron>)
    }

    render() {
        if(this.state.weatherLoaded) {
            return this.renderCurrentWether();
        }
        return (
            <p className="App-intro">
                Hello, from Home page.
            </p>
        )
    }
}

export default Home