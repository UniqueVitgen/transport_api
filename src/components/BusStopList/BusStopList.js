import React, { Component } from 'react';
import axios from "axios";
import {Col} from "react-bootstrap";

class BusStopList extends Component {

    totalPage;
    busList;
    busElements;

    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        }
    }

    render() {
        return (
            <div>
                {this.busElements}
            </div>
        )
    }
    componentDidMount() {
        this.getBusList();
    }

    getBusList() {

        const self = this;

        axios.get('https://api.tfl.gov.uk/StopPoint/Mode/bus?app_id=543007d4&app_key=d1e040b323ffab9fa0993036bbf2bf1b&page=1')
            .then(response =>
                {
                    console.log(response);
                    self.totalPage = response.data.total / 1000;
                    self.busList = response.data.stopPoints;
                    self.busElements = self.busList.map((element, index) => {
                        return (
                            <div>
                                {element.commonName}
                            </div>
                        )
                    });
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
}

export default BusStopList