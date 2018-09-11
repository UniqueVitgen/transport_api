import React, { Component } from 'react';
import axios, {CancelToken} from 'axios';
import {Col, FormControl, FormGroup, Pagination, Row, Well} from "react-bootstrap";
import './RouteList.css';
import {Link} from "react-router-dom";

class RouteList extends Component {
    routeList;
    routeElements;
    constructor(props) {
        super(props);
        // this.handleSearchKeyUp = this.keyUpHandler.bind(this, 'SearchInput');

        this.state = {
            requestCompleted:false
        };
    }


    componentDidMount() {
        const self = this;

        axios.get('https://api.tfl.gov.uk/Line/Mode/bus/Route?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.doModificationFromRequest(response.data);
                    // self.routeList = response.data;
                    // self.routeElements = self.routeList.map( (routeElement, index) => {
                    //     return <Col xs={3} md={2} key={routeElement.id}>
                    //         <a>
                    //             <Link to={'/RoutePage/' + routeElement.id}>{routeElement.name}</Link>
                    //         </a>
                    //     </Col>
                    // });
                    // console.log(this.routeElements);
                    // // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );

    }

    createElements(elements) {
        if(elements) {
            return elements.map( (routeElement, index) => {
                return <div key={routeElement.id}>{routeElement.name}</div>
            });
        }
    }

    renderEmptyPage() {
        return (
            <div>sadly, not items</div>
        );
    }

    renderSearchSection() {
        return (
            <FormGroup controlId="formValidationError4">
                <input value={this.state.search} className="form-control" onChange={this.keyUpHandler.bind(this)}   placeholder="Bus route" type="text" />
                {this.getPaginator()}
            </FormGroup>
        );
    }

    renderItemsPage() {
        const self = this;
        if(this.state.requestCompleted) {
            if(this.routeList.length > 0) {
                return (
                    <div>
                        {this.routeElements}
                    </div>
                )
            }
            else {
                return (
                    <Well>
                        No matched Routes.
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

    keyUpHandler(e) {
        // console.log(e);
        var value = e.target.value;
        console.log(e.target.value);
        this.httpSearchRoutes(value);
        // console.log(e.keyCode());
        // prints either LoginInput or PwdInput
    }

    render() {
        // if(this.state.requestCompleted){
            return (
                <div>
                    {this.renderSearchSection()}
                <Row  className="show-grid">
                    {this.renderItemsPage()}
                </Row>
                </div>
            );
        // }
        // else {
        //     return this.renderEmptyPage();
        // }
    }


    doModificationFromRequest(routes) {
        const self = this;
        self.routeList = routes;
        console.log('routes', routes);
        self.routeElements = self.routeList.map( (routeElement, index) => {
            if(routeElement.id) {
                return <Col className="col-link" xs={3} md={2} key={routeElement.id}>
                    {/*<a className={}>*/}
                        <Link to={'/RoutePage/' + routeElement.id} className="link-name">{routeElement.name}</Link>
                    {/*</a>*/}
                </Col>
            }
            else {
                return <Col className="col-link" xs={3} md={2} key={routeElement.lineId}>
                    {/*<a>*/}
                        <Link to={'/RoutePage/' + routeElement.lineId} className="link-name">{routeElement.lineName}</Link>
                    {/*</a>*/}
                </Col>
            }
        });
        console.log(self.routeElements);
        // self.state.requestCompleted = true;
        self.setStateWithObject({requestCompleted: true})

    }

    setStateWithObject(obj) {
        var pastState = this.state;
        for(let prop in obj) {
            pastState[prop] = obj[prop];
        }
        this.setState(pastState);
        console.log(this.state);
    }

    httpSearchRoutes(value) {
        const self = this;
        this.setStateWithObject(
            {
                search: value,
                requestCompleted: false
            }
            );

        axios.get('https://api.tfl.gov.uk/Line/Search/' + value +'?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b&modes=bus')
            .then(response =>
                {
                    console.log(response)
                    self.doModificationFromRequest(response.data.searchMatches);
                    self.setStateWithObject({search: value});
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

    clickPaginator(value) {
        this.httpSearchRoutes(value);
    }
}

export default RouteList