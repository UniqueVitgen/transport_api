import React, { Component } from 'react';
import axios from 'axios';
import {Button, Col, Jumbotron, ListGroup, ListGroupItem, OverlayTrigger, Tooltip} from "react-bootstrap";
import Pagination from "react-bootstrap/es/Pagination";
import {Link} from "react-router-dom";

class Home extends Component {

    currentWeather;
    favouriteRoutes;
    favouriteStops;
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

    getCurrentWeatherTooltip() {
        return(
            <Tooltip id="tooltip">
                <div>this.currentWeather.weather[0].main</div>
            </Tooltip>
        )
    }

    renderCurrentWether() {
        if(this.state.weatherLoaded) {
            return (<Jumbotron>
                <h1>{this.currentWeather.name}</h1>
                <p>
                    {/*<OverlayTrigger placement="left" overlay={this.getCurrentWeatherTooltip.bind(this)}>*/}
                    <img src={'weather/' + this.currentWeather.weather[0].main + '.png'}/>
                    {/*</OverlayTrigger>*/}
                    {this.currentWeather.main.temp} °C
                </p>
                {/*<p>*/}
                {/*<Button bsStyle="primary">Learn more</Button>*/}
                {/*</p>*/}
            </Jumbotron>)
        }
        else {
            return (
                <img src="/loaded.gif"/>
            )
        }
    }

    renderFavouriteRoutes() {

        this.favouriteRoutes = this.getRoutesFavoutite();
        if(this.favouriteRoutes && this.favouriteRoutes.length > 0) {
            const routeElements = this.createRouteElements(this.favouriteRoutes);
            return (
                <Jumbotron>
                    <span className="stop-point-name">Favourite Routes</span>
                    <ListGroup>
                        {routeElements}
                    </ListGroup>
                </Jumbotron>
            )
        }
    }

    renderFavouriteStops() {

        this.favouriteStops = this.getStopsFavoutite();
        if(this.favouriteStops && this.favouriteStops.length > 0) {
            const stopElements = this.createStopElements(this.favouriteStops);
            return (
                <Jumbotron>
                    <span className="stop-point-name">Favourite Bus Stops</span>
                    <ListGroup>
                        {stopElements}
                    </ListGroup>
                </Jumbotron>
            )
        }
    }

    render() {
        // if(this.state.weatherLoaded) {
        return (
            <div>
                {this.renderCurrentWether()}
                {this.renderFavouriteRoutes()}
                {this.renderFavouriteStops()}
            </div>
        );
        // }
        // return (
        //     <p className="App-intro">
        //         Hello, from Home page.
        //     </p>
        // )
    }

    createRouteElements(routeItems) {
        const routeElements = routeItems.map((element) => {
            // const
            return (
                <Link to={"/RoutePage/" + element.id } >
                    <ListGroupItem href="#">
                    <span className="line-name">
                        {element.id}
                        &nbsp;
                    </span>
                        {element.routeSections[0].name}
                        &nbsp;
                        <span className="expected-arrive">
                            <span className="glyphicon glyphicon-chevron-right"></span>
                        </span>
                        {/*<span className="expected-arrive">*/}
                        {/*{this.getIntervalTime(element.expectedArrival)}*/}
                        {/*{new Intl.DateTimeFormat('en-GB', {*/}
                        {/*minute: '2-digit',*/}
                        {/*hour: '2-digit'*/}
                        {/*}).format(new Date(element.expectedArrival))}*/}
                        {/*</span>*/}
                    </ListGroupItem>
                </Link>
            );
        });

        return routeElements;
    }

    createStopElements(busStopItems) {
        const busStopElements = busStopItems.map((element) => {
            // const
            return (
                <Link to={'/busStop/' + element.id}>
                    <ListGroupItem href="#">
                        {element.commonName}
                        <span className="expected-arrive">
                                <span className="glyphicon glyphicon-chevron-right"></span>
                            </span>
                    </ListGroupItem>
                </Link>
            );
        });

        return busStopElements;
    }


    getRoutesFavoutite() {
        let routesFavouriteStr = localStorage.getItem('routes');
        if(routesFavouriteStr) {
            let routesFavourite = JSON.parse(routesFavouriteStr);
            return routesFavourite;
        }
    }

    getStopsFavoutite() {
        let stopsFavouriteStr = localStorage.getItem('stops');
        if(stopsFavouriteStr) {
            let stopsFavourite = JSON.parse(stopsFavouriteStr);
            return stopsFavourite;
        }
    }
}

export default Home