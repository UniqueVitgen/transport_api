import React, { Component } from 'react';
import logo from '../../logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {MenuItem, Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "../Home/Home";
import RouteList from "../RouteList/RouteList";
import BusStopList from "../BusStopList/BusStopList";
import BusStopPage from "../BusStopPage/BusStopPage";
import RoutePage from "../RoutePage/RoutePage";
import Toolbar from "../Toolbar/Toolbar";


class App extends Component {
  render() {
    return (
        <Router>
            <div className="App">
                <Toolbar/>
                <div className="container">
                    <Route exact path="/" component={Home} />
                    <Route path="/routeList" component={RouteList} />
                    <Route path="/busStopList" component={BusStopList} />
                    <Route path="/busStop/:id" component={BusStopPage} />
                    <Route path="/RoutePage/:id" component={RoutePage} />
                    <Route path="/RoutePage/:id/:bus" component={RoutePage} />
                </div>
            </div>
        </Router>
    );
  }
}

export default App;
