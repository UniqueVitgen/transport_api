import React, { Component } from 'react';
import axios, {CancelToken} from "axios";
import {Col, FormGroup, ListGroup, ListGroupItem, Pagination, Well} from "react-bootstrap";
import {Link} from "react-router-dom";
import './BusStopList.css';

class BusStopList extends Component {

    totalPage;
    busList;
    busElements;

    cancelHanlder;

    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        }
    }

    render() {
        return (
            <div>
                <FormGroup controlId="formValidationError4">
                    <input value={this.state.search} className="form-control" onChange={this.keyUpHandler.bind(this)}   placeholder="Bus route" type="text" />
                </FormGroup>
                {this.getPaginator()}
                {this.renderItems()}
            </div>
        )
    }

    renderItems() {
        if(this.state.loaded) {
            if(this.busList.length > 0) {
                return (
                    <ListGroup>
                        {this.busElements}
                    </ListGroup>
                )
            }
            else {
                return (
                    <Well>
                        No matched bus stops.
                    </Well>
                )
            }
        }
        else {
            return (
                <img src="/loaded.gif"/>
            )
        }
    }

    componentDidMount() {
        this.getBusList();
    }

    getBusList() {

        const self = this;
        self.setState({
            loaded: false
        });

        axios.get('https://api.tfl.gov.uk/StopPoint/Mode/bus?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b&page=1')
            .then(response =>
                {
                    console.log(response);
                    self.totalPage = response.data.total / 1000;
                    this.doModificationFromRequest(response.data.stopPoints)
                    // self.busList = response.data.stopPoints;
                    // self.busElements = self.busList.map((element, index) => {
                    //     return (
                    //         <div>
                    //             {element.commonName}
                    //         </div>
                    //     )
                    // });
                    // self.state.loaded = true;
                    self.setState({
                        loaded: true
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


    keyUpHandler(e) {
        // console.log(e);
        var value = e.target.value;
        console.log(e.target.value);
        this.httpSearchStopPoints(value);
        // console.log(e.keyCode());
        // prints either LoginInput or PwdInput
    }

    clickPaginator(value) {
        this.httpSearchStopPoints(value);
    }

    doModificationFromRequest(values) {
        console.log('bus list', values);
        const self = this;
        self.busList = values;
        self.busElements = self.busList.map((element, index) => {
            if(element.commonName) {
                return (
                    <Link to={'/busStop/' + element.id}>
                        <ListGroupItem href="#">
                            {element.commonName}
                            <span className="expected-arrive">
                                <span className="glyphicon glyphicon-chevron-right"></span>
                            </span>
                        </ListGroupItem>
                    </Link>
                )
            }
            else {
                return (
                    <Link to={'/busStop/' + element.id}>
                        <ListGroupItem href="#">
                            {element.name}
                            <span className="expected-arrive">
                                <span className="glyphicon glyphicon-chevron-right"></span>
                            </span>
                        </ListGroupItem>
                    </Link>
                )
            }
        });

    }

    setStateWithObject(obj) {
        var pastState = this.state;
        for(let prop in obj) {
            pastState[prop] = obj[prop];
        }
        this.setState(pastState);
        console.log(this.state);
    }

    httpSearchStopPoints(value) {
        console.log('value', value);
        const self = this;
        self.setStateWithObject(
            {
                search: value,
                loaded: false
            }
            );
        console.log(self.cancelHandler);
        if(self.cancelHandler) {
            self.cancelHandler();
            self.cancelHandler = null;
        }
        if(value != "") {
            axios.get('https://api.tfl.gov.uk/StopPoint/Search?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b&modes=bus&query=' + value, {
                cancelToken: new CancelToken(function executor(c) {
                    // An executor function receives a cancel function as a parameter
                    self.cancelHandler = c;
                })
            })
                .then(response =>
                    {
                        // console.log(response);
                        self.totalPage = response.data.total / 1000;

                        this.doModificationFromRequest(response.data.matches);

                        self.setStateWithObject({
                            loaded: true
                        });
                        self.setStateWithObject({search: value})
                        // self.doModificationFromRequest(response.data.searchMatches);
                        // self.routeList = response.data;
                        // self.routeElements = self.routeList.map( (routeElement, index) => {
                        //     return <Col xs={3} md={2} key={routeElement.id}>
                        //         <a>
                        //             <Link to={'/RoutePage/' + routeElement.id}>{routeElement.name}</Link>
                        //         </a>
                        //     </Col>
                        // });
                        // console.log(self.routeElements);
                        // // self.state.requestCompleted = true;
                        // self.setState({requestCompleted: true})
                    }
                );
        }

    }

    genCharArray(charA, charZ) {
        var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
        for (; i <= j; ++i) {
            a.push(String.fromCharCode(i));
        }
        return a;
    }


    getPaginator() {
        // console.log(this.genCharArray('a','z'));
        // console.log(this.genCharArray('1','9'));
        const alphabet = this.genCharArray('a,','z').map((value) => {
            return (
                <Pagination.Item onClick={this.clickPaginator.bind(this,value)}>
                    {value}
                </Pagination.Item>
            )
        });
        const letters = this.genCharArray('1','9').map((value) => {
            return (
                <Pagination.Item onClick={this.clickPaginator.bind(this,value)}>
                    {value}
                </Pagination.Item>
            );

        });

        return (
            <div>
                <Pagination>
                    {alphabet}
                    {letters}
                </Pagination>
            </div>
        )
    }
}

export default BusStopList