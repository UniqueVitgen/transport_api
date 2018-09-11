import React, { Component } from 'react';
import axios from "axios";
import {Jumbotron, ListGroup, ListGroupItem, Pager, Pagination, Well} from "react-bootstrap";
import {Link} from "react-router-dom";
import {StarBorder, Star} from '@material-ui/icons';
import './BusStopPage.css';

class BusStopPage extends Component {
    id;
    bus;
    routeList;
    routeItems;
    routeElements;
    arrivals;
    arrivalElements;
    stopPoint;

    constructor(props) {
        super(props);

        console.log('props', props);
        this.id = props.match.params.id;
        this.bus = props.match.params.bus;
        console.log(this.id);
        this.state = {
            loaded: false,
            loadedStopPoint: false,
            loadedRouteList: false,
            isFavourite: false
        }
    }

    componentDidMount() {
        console.log("Mounted!");
        this.getArrivalsBusTimes();
        this.httpStopPoint();
        this.httpRouteList();
    }

    render() {
        return (
            <div>
                {this.getBusStopInfo()}
                {this.getPaginatorWithRoutes()}
                {this.getArrivalsElements()}
                {this.renderRouteList()}
            </div>
        )
    }

    getArrivalsBusTimes() {

        const self = this;
        this.setStateWithObject({loaded: false});
        // var flags = [], output = [], l = array.length, i;
        // for( i=0; i<l; i++) {
        //     if( flags[array[i].age]) continue;
        //     flags[array[i].age] = true;
        //     output.push(array[i].age);
        // }

        axios.get('https://api.tfl.gov.uk/StopPoint/' + this.id + '/Arrivals?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.arrivals = self.sortArrivalList(response.data);
                    self.routeList = self.createRouteList(self.arrivals);
                    if(self.bus) {
                        self.arrivals = self.arrivals.filter((element) => {
                            return element.lineName == self.bus;
                        })
                    }
                    self.arrivalElements = self.createArrivalElements(self.arrivals);
                    self.setStateWithObject({
                        loaded: true,
                        // bus: self.bus
                    })
                    // self.route = response.data;
                    // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );
    }

    httpStopPoint() {

        const self = this;
        this.setStateWithObject({loadedStopPoint: false});

        axios.get('https://api.tfl.gov.uk/StopPoint/' + this.id + '?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.stopPoint = response.data;
                    self.setStateWithObject({
                        loadedStopPoint: true,
                        isFavourite: this.containInStopFavourite(this.stopPoint)
                    })
                }
            );

    }

    httpRouteList() {

        const self = this;
        self.setStateWithObject({
            loadedRouteList: false
        });

        axios.get('https://api.tfl.gov.uk/StopPoint/' + this.id + '/Route?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log('routeList http', response);
                    self.routeItems = response.data;
                    self.routeElements = self.createRouteElements(self.routeItems);
                    // self.busList = response.data.stopPoints;
                    // self.busElements = self.busList.map((element, index) => {
                    //     return (
                    //         <div>
                    //             {element.commonName}
                    //         </div>
                    //     )
                    // });
                    // self.state.loaded = true;
                    self.setStateWithObject({
                        loadedRouteList: true
                    })
                    // self.routeList = response.data;
                    // self.routeElements = self.routeList.map( (routeElement, index) => {
                    //     return <Col xs={3} md={2} key={routeElement.id}>
                    //         {routeElement.name}
                    //     </Col>
                    // });
                    // console.log(this.routeElements);
                    // // self.state.requestCompleted = true;
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

    createRouteList(arrivals) {
        var flags = [], output = [], array = arrivals, l = array.length, i;
        for( i=0; i<l; i++) {
            if( flags[array[i].lineName]) continue;
            flags[array[i].lineName] = true;
            output.push(array[i].lineName);
        }
        console.log(output);
        return output;

    }

    createArrivalElements(arrivals) {
        const arrivalElements = arrivals.map((element, index) => {
            return (

                <ListGroupItem href="#">
                    <span className="line-name">
                        {element.lineName}
                        &nbsp;
                    </span>
                    {element.destinationName}
                    &nbsp;
                    <span className="expected-arrive">

                        {this.getIntervalTime(element.expectedArrival)}
                    {/*{new Intl.DateTimeFormat('en-GB', {*/}
                        {/*minute: '2-digit',*/}
                        {/*hour: '2-digit'*/}
                    {/*}).format(new Date(element.expectedArrival))}*/}
                    </span>
                </ListGroupItem>
            )
        });
        return arrivalElements;
    }

    createRouteElements(routeItems) {
        const routeElements = routeItems.map((element) => {
            return (
                <Link to={"/RoutePage/" + element.lineId } >
                    <ListGroupItem href="#">
                    <span className="line-name">
                        {element.lineId}
                        &nbsp;
                    </span>
                {element.routeSectionName}
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

    getPaginatorWithRoutes() {
        if(this.routeList && this.routeList.length > 0) {
            const self = this;
            const routeElements = this.routeList.map((element, index) => {
                return (

                    <Pagination.Item active={self.bus === element} onClick={self.paginationClick.bind(self, element)}>
                        <Link to={"/busStop/" + self.id + '/' + element}>
                            {element}
                            </Link>
                    </Pagination.Item>

                )
            });
            return (
                <Pagination>
                    <Pagination.Item active={self.bus == null} onClick={self.paginationClick.bind(self, null)} href="#">
                        <Link to={"/busStop/" + self.id }>
                            All
                        </Link>
                    </Pagination.Item>
                    {routeElements}
                </Pagination>
            )
        }
    }

    getArrivalsElements() {
        if(this.state.loaded) {
            if(this.arrivalElements && this.routeList.length > 0) {
                return (
                    <ListGroup>
                        {this.arrivalElements}
                    </ListGroup>
                )
            }
            else if(this.routeList && this.routeList.length == 0) {
                return (
                    <Well>
                        No information
                    </Well>
                )
            }
        }
        else {
            return (
                <div>
                    <img src="/loaded.gif"/>
                </div>
            )
        }
    }

    renderRouteList() {
        if(this.state.loadedRouteList) {
            // const
            if(this.routeItems.length > 0) {
                return (
                    <div>
                        <Jumbotron>
                            <span className="stop-point-name">Routes</span>
                            <ListGroup>
                                {this.routeElements}
                            </ListGroup>
                        </Jumbotron>
                    </div>
                )
            }
        }

    }

    getBusStopInfo() {
        if(this.state.loadedStopPoint) {
            if(this.stopPoint) {
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
                    <Well style={{position: 'relative'}}>
                        <span className="stop-point-name">{this.stopPoint.commonName}</span>
                        {/*<span className="expected-arrive">*/}
                        {/*<div>*/}
                            {/*<StarBorder onClick={this.clickFavourite.bind(this)} className="favourite-star expected-arrive" color="primary"/>*/}
                        {favourite}
                        {/*</div>*/}
                        {/*</span>*/}
                    </Well>
                );
            }
        }
        else {
            return (
                <div>
                    <img src="/loaded.gif"/>
                </div>
            )
        }
    }

    getIntervalTime(date) {
        const dateStr = this.calculateInterval(date)
        return (
            <span>
                {dateStr} mins
            </span>
        )
    }

    sortArrivalList(arrivalList) {
        arrivalList.sort(function (a, b) {
            if(a.expectedArrival > b.expectedArrival) {
                return 1;
            }
            else if(a.expectedArrival == b.expectedArrival) {
                return 0;
            }
            else {
                return -1;
            }
        });
        return arrivalList;
    }

    calculateInterval(date) {
        let now = new Date();
        date = new Date(date);
        let different = date.getTime() - now.getTime();
        let differentStr = new Intl.DateTimeFormat('en-GB', {
            minute: '2-digit',
            // hour: '2-digit'
        }).format(different);
        return differentStr;
    }

    paginationClick(bus) {
        console.log('click');
        this.bus = bus;
        this.getArrivalsBusTimes();
    }

    clickFavourite() {
        const self = this;
        this.setStateWithObject({isFavourite: !this.state.isFavourite});
        const favourite = this.state.isFavourite;
        if(favourite) {
            self.addToStopFavourite(self.stopPoint);
        }
        else {
            this.removeFromStopFavourite(this.stopPoint);
        }
    }

    getStopsFavoutite() {
        let stopsFavouriteStr = localStorage.getItem('stops');
        if(stopsFavouriteStr) {
            let stopsFavourite = JSON.parse(stopsFavouriteStr);
            return stopsFavourite;
        }
    }

    addToStopFavourite(stop) {
        let stopsFavourite = this.getStopsFavoutite();
        if(stopsFavourite == null) {
            stopsFavourite = [];
        }
        if(!this.containInStopFavourite(stop)) {
            stopsFavourite.push(stop);
            localStorage.setItem('stops', JSON.stringify(stopsFavourite));
        }
    }

    removeFromStopFavourite(stop) {
        let stopsFavourite = this.getStopsFavoutite();
        if(stopsFavourite == null) {
            stopsFavourite = [];
        }
        stopsFavourite = stopsFavourite.filter(value => {
            return value.id != stop.id;
        });
        localStorage.setItem('stops', JSON.stringify(stopsFavourite));
    }

    containInStopFavourite(stop) {
        let stopsFavourite = this.getStopsFavoutite();
        if(stopsFavourite == null) {
            stopsFavourite = [];
        }
        return stopsFavourite.filter((value) => {
            return value.id == stop.id;
        }).length > 0;
    }
}

export default BusStopPage