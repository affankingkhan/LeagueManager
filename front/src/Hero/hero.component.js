import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Nav,ButtonToolbar, Button  } from "react-bootstrap";
import styled from "styled-components";
import { Link, NavLink } from 'react-router-dom'
import "./hero.css";
import SignupLogin from "./SignupLogin/SignupLogin.Main"


export const HeroLayout = () => (

  <div className = "HeroPage">

        <div className="HeroNavBar">
            <Nav className="justify-content-end"
              activeKey="/home">
              <Nav.Item>
                <Nav.Link>ABOUT</Nav.Link>
              </Nav.Item>
                <Nav.Item>
              <Nav.Link as={NavLink} to='/'>FEATURES</Nav.Link>
                </Nav.Item>
              <Nav.Item>
                <Nav.Link href="https://www2.cs.sfu.ca/CourseCentral/470/bobbyc/">LINK</Nav.Link>
              </Nav.Item>

            </Nav>
      </div>
      <div className="row">
        <div className="col-6">
          <h1 className="HeaderText">League Manager App</h1>
          <h3 className="HeaderText1">Start Your Team Now!</h3>
        </div>
        <div className="col-6">
          <SignupLogin/>
        </div>
      </div>

  </div>
);
