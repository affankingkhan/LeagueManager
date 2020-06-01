import React, { Component } from "react";
import { Button, Form,Tabs,Tab } from "react-bootstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { axiosClient } from "../../axiosClient";

export default class StartNewTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      rosterData: {
        name: "",
        leagueName: "",
        season: "",
        division: "",
        sport: ""
      },
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount(){
        const vm = this;
    }

    onChangeHandler(e) {
      const vm = this;
      const {name, value} = e.target;
      let rosterData  = {...vm.state.rosterData};
      rosterData[name] = value;
  
      vm.setState({rosterData});
  }

  handleSubmit(event, values) {
    const vm = this;
    event.persist();
    const {user} = vm.props;
    let {rosterData} = vm.state;
    axiosClient
      .post(`/team/${user._id}`, rosterData)
      .then(function(response) {
        if (response.data) {
          window.location.href = `/app/team/roster/${response.data._id}`;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

    render(){
      const vm = this;
        return(
          <div className="container">
          <br/>
          <h3 className="text-center">Start New Team</h3>
          <AvForm onValidSubmit={vm.handleSubmit}>
            <AvField name="name" label="Team Name*" placeholder="ex) Raptors" type="text" required onChange={vm.onChangeHandler}/>
            <AvField name="leagueName" label="League Name" placeholder="ex) NCAA" type="text" onChange={vm.onChangeHandler}/>
            <AvField name="season" label="Season" placeholder="ex) 2020/2021" type="text" onChange={vm.onChangeHandler}/>
            <AvField name="division" label="Division" placeholder="ex) AAA" type="text" onChange={vm.onChangeHandler}/>
            <AvField name="sport" label="Sport" placeholder="ex) Basketball" type="text" onChange={vm.onChangeHandler}/>
            <button type="submit" className="btn btn-primary">Create Team</button>
          </AvForm>

          </div>
        );
    }

}
