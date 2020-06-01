import React, { Component } from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { axiosClient } from "../../axiosClient";
import loginImg from "../resources/register.svg";
import "./style.scss";
import {Snackbar} from 'react-mdl';
import UserProfile from '../../userProfile'

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                teamName: '',
            },
            isSnackbarActive: false,
            snackbarMessage: ''
        }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    }

    onChangeHandler(e) {
        const vm = this;
        const {name, value} = e.target;
        let user = {...vm.state.user}
        user[name] = value;
        vm.setState({user});
    }

    handleShowSnackbar() {
        this.setState({ isSnackbarActive: true });
    }
    handleTimeoutSnackbar() {
        this.setState({ isSnackbarActive: false });
    }


    onSubmit(e){
        const vm = this;
        e.preventDefault();
        let {user} = vm.state;
        let url = "/api/signup";

        axiosClient.post(url, user)
            .then((res) =>{
                if(res.status == 200){
                    UserProfile.setToken(res.data);
                    localStorage.setItem("token", res.data);
                    window.location.href = '/app/player/profile';
                }
            })
            .catch((error) =>{
                let {data} = error.response;
                vm.setState({snackbarMessage: data})
                vm.handleShowSnackbar();
                console.log(error);
            })
    }


    render(){
        const vm = this;
        let {snackbarMessage} = vm.state;

        return(

            <div className="base-container" ref={this.props.containerRef}>
                <div className="header">Register</div>
                <div className="content">
                    <div className="image">
                        <img src={loginImg} />
                    </div>
                </div>
                <Form onSubmit={vm.onSubmit}  className="form">
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input required type="email" name="email" id="email" onChange={vm.onChangeHandler} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="firstName">First Name</Label>
                        <Input required type="text" name="firstName" id="firstName" onChange={vm.onChangeHandler} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name</Label>
                        <Input required type="text" name="lastName" id="lastName" onChange={vm.onChangeHandler}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input required type="password" name="password" id="password" onChange={vm.onChangeHandler} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="teamName">Team Name</Label>
                        <Input required type="text" name="teamName" id="teamName" onChange={vm.onChangeHandler} />
                    </FormGroup>
                    <div className='footer'>
                        <button type='submit' className="btn btn-primary">Register</button>
                    </div>
                </Form>
                <Snackbar
                    active={vm.state.isSnackbarActive}
                    onTimeout={this.handleTimeoutSnackbar}>
                    {snackbarMessage}
                </Snackbar>
            </div>


        );
    }
}
