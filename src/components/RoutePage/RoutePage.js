import React, { Component } from 'react';
import axios from "axios";
import {Button, Col, ListGroup, ListGroupItem, Row, Well} from "react-bootstrap";
import {Link} from "react-router-dom";
import './RoutePage.css';
import {Star, StarBorder} from "@material-ui/icons";

class RoutePage extends Component {
    id;
    mode = 'inbound';

    stopPointList;
    stopPointElements;
    route;
    constructor(props) {
        super(props)

        console.log('props', props);
        this.id = props.match.params.id;
        console.log(this.id);
        this.state = {
            loadedRoute: false,
            loadedStopPoints: false
        }
    }

    setDirection() {
        if(this.mode == 'inbound') {
            this.mode = 'outbound';
        }
        else {
            this.mode = 'inbound';
        }
    }

    changeDirection() {
        // console.log(this);
        this.setDirection();
        this.getStopPoints();
    }

    render() {
        const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };
        const self = this;

        const buttonsInstance = (
            <div className="well" style={wellStyles}>
                {/*<Button bsSize="large" block>*/}
                    {/*Block level button*/}
                {/*</Button>*/}
            </div>
        );
        let favourite;
        if(this.state.isFavourite) {
            favourite = (
                <Star onClick={this.clickFavourite.bind(this)} className="favourite-star expected-arrive active"/>
            )
        }
        else {
            favourite = (
                <StarBorder onClick={this.clickFavourite.bind(this)} className="favourite-star expected-arrive" color="primary"/>
            )
        }
        return (
            <div>
                <Well style={{position: 'relative'}}>
                    <Row className="info-container">
                        {/*<Col xs={3} md={2}>*/}
                        {/*</Col>*/}
                        {this.getRouteNumber()}
                        <Col xs={9} md={6}>
                            <Button onClick={self.changeDirection.bind(self)} bsStyle="primary" bsSize="large" block>
                                Change direction
                            </Button>
                            <br/>
                            {self.getRouteElement()}
                        </Col>
                    </Row>
                    {/*<span className="expected-arrive">*/}
                    {favourite}
                    {/*</span>*/}
                </Well>
                {this.renderStopPoints()}
            </div>
        )
    }

    renderStopPoints() {
        if(this.state.loadedStopPoints) {
            return (
                <ListGroup>
                    {this.stopPointElements}
                </ListGroup>
            )
        }
        else {
            return (
                <div>
                    <img src="/loaded.gif"/>
                </div>
            )
        }
    }

    componentDidMount() {
        this.getRoute();
        this.getStopPoints();
    }

    getRouteElement() {
        if(this.state.loadedRoute) {
            if(this.route) {
                const self = this;
                var origin, destination;
                var routeSection = this.route.routeSections.filter((element => {
                    return element.direction == self.mode;
                }))[0];
                if(this.state.loadedRoute) {
                    return (
                        <div>
                            <span className="title-point">From:</span>
                            &nbsp;
                            <span className="point-text">{routeSection.originationName}</span>
                            &nbsp;
                            <span className="title-point">To:</span>
                            &nbsp;
                            <span className="point-text">{routeSection.destinationName}</span>
                        </div>
                    )
                }
                else {
                    return (
                        <div>
                            <img src="/loaded.gif"/>
                        </div>
                    )
                }
            }
        }
        else {
            // return (
            //     <div>
            //         <img src="/loaded.gif"/>
            //     </div>
            // )
        }
    }

    getStopPoints() {

        const self = this;
        self.setState({
            loadedStopPoints: false,
            // mode: self.mode
        })
        axios.get('https://api.tfl.gov.uk/Line/' + this.id + '/Route/Sequence/' + this.mode + '?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.stopPointList = response.data.stopPointSequences[0].stopPoint;
                    self.stopPointElements = self.stopPointList.map((element, index) => {
                            return (
                                <Link to={'/busStop/' + element.id + '/' + self.id}>
                                    <ListGroupItem href="#link1">
                                    <div className="step-text">{index + 1}.</div>
                                    {/*<div className="stop-point-letter">{element.stopLetter}</div>*/}
                                    {element.name}
                                    <span className="expected-arrive">
                                        <span className="glyphicon glyphicon-chevron-right"></span>
                                    </span>
                                </ListGroupItem>
                                </Link>
                            )
                    })
                    self.setState({
                        loadedStopPoints: true,
                        mode: self.mode
                    })
                    // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );
    }

    getRouteNumber() {
        if(this.route) {
            console.log(this.route);
            const self = this;
            return (
                <div className="bus-number">
                    {this.route.id}
                </div>
            )
        }
    }

    getRoute() {

        const self = this;
        this.setStateWithObject({
            loadedRoute: false
        });

        axios.get('https://api.tfl.gov.uk/Line/' + this.id + '/Route?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.route = response.data;
                    console.log('contain', this.containInRouteFavourite(this.route));
                    this.setStateWithObject({
                        loadedRoute: true,
                        isFavourite: this.containInRouteFavourite(this.route)
                    });
                    // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );
    }

    setStateWithObject(obj) {
        var pastState = this.state;
        for(let prop in obj) {
            pastState[prop] = obj[prop];
        }
        this.setState(pastState);
        console.log(this.state);
    }

    clickFavourite() {
        this.setStateWithObject({isFavourite: !this.state.isFavourite});
        const favourite = this.state.isFavourite;
        if(favourite) {
            this.addToRouteFavourite(this.route);
        }
        else {
            this.removeFromRouteFavourite(this.route);
        }
    }

    getRoutesFavoutite() {
        let routesFavouriteStr = localStorage.getItem('routes');
        if(routesFavouriteStr) {
            let routesFavourite = JSON.parse(routesFavouriteStr);
            return routesFavourite;
        }
    }

    addToRouteFavourite(route) {
        let routesFavourite = this.getRoutesFavoutite();
        if(routesFavourite == null) {
            routesFavourite = [];
        }
        if(!this.containInRouteFavourite(route)) {
            routesFavourite.push(route);
            localStorage.setItem('routes', JSON.stringify(routesFavourite));
        }
    }

    removeFromRouteFavourite(route) {
        let routesFavourite = this.getRoutesFavoutite();
        if(routesFavourite == null) {
            routesFavourite = [];
        }
        routesFavourite = routesFavourite.filter(value => {
            return value.id != route.id;
        });
        localStorage.setItem('routes', JSON.stringify(routesFavourite));
    }

    containInRouteFavourite(route) {
        let routesFavourite = this.getRoutesFavoutite();
        if(routesFavourite == null) {
            routesFavourite = [];
        }
        return routesFavourite.filter((value) => {
            return value.id == route.id;
        }).length > 0;
    }

}

export default RoutePage