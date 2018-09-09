import React, { Component } from 'react';
import axios from 'axios';
import {Col, Row} from "react-bootstrap";
import './RouteList.css';
import {Link} from "react-router-dom";

class RouteList extends Component {
    routeList;
    routeElements;
    constructor(props) {
        super(props);

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
                    self.routeList = response.data;
                    self.routeElements = self.routeList.map( (routeElement, index) => {
                        return <Col xs={3} md={2} key={routeElement.id}>
                            <a>
                                <Link to={'/RoutePage/' + routeElement.id}>{routeElement.name}</Link>
                            </a>
                        </Col>
                    });
                    console.log(this.routeElements);
                    // self.state.requestCompleted = true;
                    self.setState({requestCompleted: true})
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

    renderItemsPage() {
        return (
            <div>{this.routeElements}</div>
        )
    }

    render() {

        if(this.state.requestCompleted){
            return (
                <Row  className="show-grid">
                    {this.renderItemsPage()}
                </Row>
            );
        }
        else {
            return this.renderEmptyPage();
        }
    }
}

export default RouteList