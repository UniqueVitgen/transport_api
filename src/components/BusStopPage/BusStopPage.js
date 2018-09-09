import React, { Component } from 'react';
import axios from "axios";
import {ListGroup, ListGroupItem, Pager, Pagination, Well} from "react-bootstrap";
import {Link} from "react-router-dom";
import './BusStopPage.css';

class BusStopPage extends Component {
    id;
    routeList;
    arrivals;
    arrivalElements;
    stopPoint;

    constructor(props) {
        super(props)

        console.log('props', props);
        this.id = props.match.params.id;
        console.log(this.id);
        this.state = {
            loaded: false,
            loadedStopPoint: false
        }
    }
    componentDidMount() {
        this.getArrivalsBusTimes();
        this.httpStopPoint();
    }

    render() {
        return (
            <div>
                {this.getBusStopInfo()}
                {this.getPaginatorWithRoutes()}
                {this.getArrivalsElements()}
            </div>
        )
    }

    getArrivalsBusTimes() {

        const self = this;
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
                    self.arrivalElements = self.createArrivalElements(self.arrivals);
                    this.setStateWithObject({
                        loaded: true
                    })
                    // self.route = response.data;
                    // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );
    }

    httpStopPoint() {

        const self = this;

        axios.get('https://api.tfl.gov.uk/StopPoint/' + this.id + '?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.stopPoint = response.data;
                    this.setStateWithObject({
                        loadedStopPoint: true
                    })
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

                <ListGroupItem href="#link1">
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

    getPaginatorWithRoutes() {
        if(this.routeList) {
            const self = this;
            const routeElements = this.routeList.map((element, index) => {
                return (
                    <Pagination.Item>
                        <Link to={"/busStop/" + self.id + '/' + element}>{element}</Link>
                    </Pagination.Item>
                )
            });
            return (
                <Pagination>
                    <Pagination.Item href="#">All</Pagination.Item>
                    {routeElements}
                </Pagination>
            )
        }
    }

    getArrivalsElements() {
        if(this.arrivalElements) {
            return (
                <ListGroup>
                    {this.arrivalElements}
                </ListGroup>
            )
        }
    }

    getBusStopInfo() {
        if(this.stopPoint) {
            return (<Well>
                <span className="stop-point-name">{this.stopPoint.commonName}</span>
            </Well>);
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
}

export default BusStopPage