import React, { Component } from "react";
import { Button, Form,Tabs,Tab } from "react-bootstrap";
import { axiosClient } from "../../../axiosClient";

export default class ProfileUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //hardcode current user id
      curr_user_id : props.user._id,
      curr_user:[],
      hidden: true,
      new_info:{firstName:"",lastName:""},
      new_password:{newPassword:"",confirmNew:""}
    };


    this.toggleShow = this.toggleShow.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
  }


componentDidMount() {
    const userID = this.state.curr_user_id;
    axiosClient
      .get(`/profile/${userID}`)
      .then(response => {
        this.setState({curr_user :response.data});
      })
      .catch(error => {
        console.log(error.response);
      });

  }

onChangeHandler(e){
  const {name, value} = e.target;
  let new_info  = {...this.state.new_info};
  new_info[name] = value;
  this.setState({new_info});
}
changePassword(e){
  const {name, value} = e.target;
  let new_password  = {...this.state.new_password};
  new_password[name] = value;
  this.setState({new_password});
}


 toggleShow() {
   this.setState({ hidden: !this.state.hidden });
 }


onSubmitHandler(event,value){
  event.persist();
  const userID = this.state.curr_user_id;
  let url = `/profile/updateinfo/${userID}`

  let { new_info } = this.state;

  axiosClient
    .post(url, new_info)
    .then(function(response) {
      if(response.data){
        window.location.reload();
      }
      })
    .catch(function(error) {
      console.log(error);
    });

}

onSubmitPassword(){
  let { new_password } = this.state;
  if (new_password.newPassword != new_password.confirmNew){
    alert("The confirmed password is different from new password!");
  }
  else{
    //post request

    const userID = this.state.curr_user_id;
    let url = `/profile/updatepassword/${userID}`

    let { new_password } = this.state;

    axiosClient
      .post(url, new_password)
      .then(function(response) {
        if(response.data){
          window.location.reload();
        }
        })
      .catch(function(error) {
        console.log(error);
      });
  }
}


  render() {
    return (
      <div className="container">
        <Tabs className="justify-content-center" defaultActiveKey="profile">
          <Tab eventKey="profile" title="Profile">

          <Form onSubmit={this.onSubmitHandler}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="name" name="firstName" required placeholder={this.state.curr_user.firstName}
              onChange={this.onChangeHandler}/>

            </Form.Group>

            <Form.Group controlId="formLastLame">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="name" name="lastName" required placeholder={this.state.curr_user.lastName}
              onChange={this.onChangeHandler} />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" readOnly placeholder={this.state.curr_user.email} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Profile
            </Button>
            </Form>
          </Tab>


          <Tab eventKey="password" title="Password">

          <Form>
            <Form.Group controlId="formCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" readOnly value='password' />
            </Form.Group>

            <Form.Group controlId="formNewtPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control name="newPassword" type={this.state.hidden ? "password" : "text" }required onChange={this.changePassword}/>
            </Form.Group>

            <Form.Group controlId="formFirstLame">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control name="confirmNew" type={this.state.hidden ? "password" : "text"} required onChange={this.changePassword}/>

            </Form.Group>

            <Form.Group controlId = "visualizePassword">
            <Form.Check type="checkbox" label="Show Password" onClick={this.toggleShow}/>
            </Form.Group>
            <Button variant="primary" type="button" onClick={this.onSubmitPassword}>
              Change Password
            </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
