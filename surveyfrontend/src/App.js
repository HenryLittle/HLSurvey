import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import { HomePage } from "./home/Home";
import { CreatorPage } from "./creator/Creator";
import { SignUpPage } from "./auth/SignUp";
import { SignInPage } from "./auth/SignIn";
import { SurveyList } from "./surveys/SurveyList";
import { getUserToken } from "./index";

import "bootstrap/dist/css/bootstrap.css";
// antd styles
import 'antd/dist/antd.css';

import { Button, Space, Layout, Menu, Breadcrumb } from "antd";
const { Header, Content, Footer } = Layout;



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoggedIn: false,
      selectedKey: ['0']
    };
    this.menuItemSelected = this.menuItemSelected.bind(this);
    this.logout = this.logout.bind(this);
  }

  menuItemSelected(event) {
    console.log(event.key);

  }

  logout() {
    localStorage.removeItem("survey-token");
    localStorage.removeItem("survey-refresh-token");
    this.componentDidMount();
  }


  componentDidMount() {
    getUserToken(token => {
      this.setState({
        hasLoggedIn: token != null
      });
    });
  }

  render() {
    const hasLoggedIn = this.state.hasLoggedIn;
    return (
      <Router>
        <div>
          <Layout className="layout">
            <Header>
              {hasLoggedIn ?
                <Menu theme="dark" mode="horizontal" onSelect={this.menuItemSelected} defaultSelectedKeys={['']} selectedKeys={['']}>
                  <Menu.Item key="0"><Link to="/"><b>HL Survey</b></Link></Menu.Item>
                  <Menu.Item key="1"><Link to="/survey">My Surveys</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/creator">Survey Creator</Link></Menu.Item>
                  <Menu.Item key="3" onClick={this.logout}><Link to="/">Logout</Link></Menu.Item>
                </Menu>
                :
                <Menu theme="dark" mode="horizontal" onSelect={this.menuItemSelected} defaultSelectedKeys={['']} selectedKeys={['']}>
                  <Menu.Item key="0"><Link to="/"><b>HL Survey</b></Link></Menu.Item>
                  <Menu.Item key="1"><Link to="/signin">Sign In</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/signup">Sign Up</Link></Menu.Item>
                </Menu>
              }
            </Header>
            <Content style={{ padding: '16px 50px' }}>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route path="/signup">
                  <SignUpPage />
                </Route>
                <Route path="/signin">
                  <SignInPage />
                </Route>
                <Route path="/survey">
                  <SurveyList />
                </Route>
                <Route path="/creator">
                  <CreatorPage />
                </Route>
                {/* <Route path="/export">
                  <ExportToPDFPage />
                </Route> */}
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center' }}>HL Production ©2020 Created by Henry Little</Footer>
          </Layout>,
        </div>
      </Router>
    );
  }
}

export { App };