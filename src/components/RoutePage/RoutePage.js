import React, { Component } from 'react';
import axios from "axios";
import {Button, Col, ListGroup, ListGroupItem, Row, Well} from "react-bootstrap";
import {Link} from "react-router-dom";
import './RoutePage.css';

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
            loaded: false
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
        return (
            <div>
                <Well>
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
                </Well>
                <ListGroup>
                {this.stopPointElements}
                </ListGroup>
            </div>
        )
    }

    componentDidMount() {
        this.getRoute();
        this.getStopPoints();
    }

    getRouteElement() {
        if(this.route) {
            const self = this;
            var origin, destination;
            var routeSection = this.route.routeSections.filter((element => {
                return element.direction == self.mode;
            }))[0];
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
    }

    getStopPoints() {

        const self = this;
        axios.get('https://api.tfl.gov.uk/Line/' + this.id + '/Route/Sequence/' + this.mode + '?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.stopPointList = response.data.stopPointSequences[0].stopPoint;
                    // console.log('elemennts')
                    self.stopPointElements = self.stopPointList.map((element, index) => {
                            return (
                                <Link to={'/busStop/' + element.id}>
                                    <ListGroupItem href="#link1">
                                    <div className="step-text">{index + 1}.</div>
                                    {/*<div className="stop-point-letter">{element.stopLetter}</div>*/}
                                    {element.name}
                                </ListGroupItem>
                                </Link>
                            )
                    })
                    self.setState({
                        loaded: true,
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

        axios.get('https://api.tfl.gov.uk/Line/' + this.id + '/Route?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b')
            .then(response =>
                {
                    console.log(response);
                    self.route = response.data;
                    // self.state.requestCompleted = true;
                    // self.setState({requestCompleted: true})
                }
            );
    }

}

export default RoutePage