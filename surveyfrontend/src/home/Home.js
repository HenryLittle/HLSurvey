import React, { Component } from "react";
import logo from "./logo.svg";


import { getUserToken, getUserId } from '../index';

class HomePage extends Component {

    constructor(prop) {
        super(prop);
        this.state = {
            name: ""
        };
    }

    getUserName() {
        getUserToken(token => {
            if (token != null) {
                console.log(token);
                this.setState({
                    name: getUserId(token)
                });
            }
        });
    }

    componentDidMount() {
        this.getUserName();
    }

    render() {
        const name = this.state.name;
        return (
            <div className="container">
                <div className="col-lg-3 centered">
                    <img className="App-logo" src={logo} alt="ReactJS" />
                </div>
                <div className="col-lg-9 jumbotron">
                    <h1>Welcome to HL Survey</h1>
                    <p>
                        This is a simple site to help you create and share surveys on the fly. Written with ReactJS and SurveyJS.
                    </p>
                    <p>
                        Your id number is: {name}
                    </p>
                </div>
            </div>
        );
    }
}


export { HomePage };
