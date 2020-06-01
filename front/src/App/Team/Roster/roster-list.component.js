import React, { Component } from "react";
import { axiosClient } from "../../../axiosClient";
import RosterAddModal from "./roster_add_modal";
import PlayersMap from "./PlayersMap.compoent";
import { AvForm, AvField } from "availity-reactstrap-validation";

export default class RosterList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser:{},
      teamName: "",
      players: [],
      coaches: [],
      add_modal: {
        isOpen: false
      },
      playerMapAddress: [],
      onChangeAddress: ""
    };

    this.handleAddModalOpen = this.handleAddModalOpen.bind(this);
    this.handleAddModalClose = this.handleAddModalClose.bind(this);
    this.playersRender = this.playersRender.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.coachesRender = this.coachesRender.bind(this);
    this.addPlayerMap = this.addPlayerMap.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.addressSubmit = this.addressSubmit.bind(this);
    this.addressRemove = this.addressRemove.bind(this);
  }

  componentDidMount() {
    const vm = this;

  }

  handleAddModalOpen() {
    const vm = this;
    let add_modal = vm.state.add_modal;
    add_modal.isOpen = true;
    vm.setState(add_modal);
  }

  handleAddModalClose(event) {
    const vm = this;
    let {add_modal} = vm.state;
    add_modal.isOpen = false;
    vm.setState(add_modal);
  }

  playersRender(dataRender) {
    const vm = this;
    const {defaultTeam, currentUser, coaches} = vm.props;

    let ret =  dataRender.map(data => {
      let buttons = <button type="button" className="btn btn-danger btn-xs" onClick={()=>vm.onDelete(data)}>Remove</button>
      if(coaches.length != 0 && coaches[0]._id == data._id)
      {
        buttons = "";
      }

      return (
      <tr className='text-center' key={data._id}>
      <td>{data.firstName}</td>
      <td>{data.lastName}</td>
      <td>{data.email}</td>
      <td>{data.createdAt.substring(0, 10)}</td>
      <td>
          {buttons}
      </td>
    </tr>);
    });

    return ret;
  }

  onDelete(currentUsers){
    if (!window.confirm('Are you sure to remove this player?')) return;

    const vm = this;
    const {defaultTeam} = vm.props;

    let url = `/roster/${defaultTeam._id}`;

    axiosClient
      .delete(url, {data: currentUsers})
      .then(function(response) {
        if (response.data) {
          window.location.reload();
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  coachesRender(dataRender){
    const vm = this;
    let ret =  dataRender.map(data => (
      <tr className='text-center' key={data._id}>
      <td>{data.firstName}</td>
      <td>{data.lastName}</td>
      <td>{data.email}</td>
      <td>{data.createdAt.substring(0, 10)}</td>
    </tr>
    ));

    return ret;
  }

  addPlayerMap(){
    const vm = this;
    const {defaultTeam, currentUser, playerMapAddress} = vm.props;

    let ret = 
    <AvForm onValidSubmit={vm.addressSubmit}>
      <AvField name="playerMapAddress" label="Add your address" type="text" placeholder="ex) 8888 University Drive" onChange={vm.onChangeHandler}/>
      <button type="submit" className="btn btn-success">Save</button>
    </AvForm>;

    playerMapAddress.filter(playerAddress=> {
    if(playerAddress.userId._id === currentUser._id){
      ret = 
        <AvForm onValidSubmit={()=>vm.addressRemove(playerAddress._id)}>
          <AvField name="playerMapAddress" label="Your address" type="text" placeholder={playerAddress.address} disabled />
          <button type="submit" className="btn btn-danger">Remove</button>
        </AvForm>;
    }
    });

  return ret;
  }

  onChangeHandler(e){
    const vm = this;
    const {name, value} = e.target;
    let onChangeAddress  = value;

    vm.setState({onChangeAddress});
  }

  addressSubmit(){
    const vm = this;
    const {onChangeAddress} = vm.state;
    const {defaultTeam, currentUser} = vm.props;

    const url = `/users/address/${currentUser._id}`;
    axiosClient
      .post(url, {userAddress: onChangeAddress})
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  addressRemove(playerAddress){
    if (!window.confirm('Are you sure to remove this address?')) return;
    const vm = this;
    const url = `/users/address/${playerAddress}`;
    axiosClient
      .delete(url)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const vm = this;    
    const {defaultTeam, players, coaches, playerMapAddress, currentUser} = vm.props;
  

    let add_modal_elements = "";
    if (vm.state.add_modal.isOpen) {
      add_modal_elements = (
        <RosterAddModal
          modal={vm.state.add_modal}
          handleAddModalClose={vm.handleAddModalClose}
          teamId={defaultTeam._id}
        />
      );
    }

    let addPlayersButton = "";
    
    if(coaches.length != 0 && currentUser._id == coaches[0]._id)
    {
      addPlayersButton = <button className="btn btn-primary" type="button" onClick={vm.handleAddModalOpen}>Add Player</button>;
    }

    let addPlayerMap = vm.addPlayerMap();
    
    let googleKey = 'AIzaSyDhy_2nfBjxv7J09kei3kqNlXsdmIpkIx4';
    return (
      <div className="container-fluid ">
        <div className="row">
        <div className="col-sm-7">
        
        <h3 className="text-center">Players</h3>
        <table className="table">
          <thead className="thead-light text-center">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>CreatedAt</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>{vm.playersRender(players)}</tbody>
        </table>
          {addPlayersButton}
        <br/>
        <h3 className="text-center">Coaches</h3>
        <table className="table">
          <thead className="thead-light text-center">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>CreatedAt</th>
            </tr>
          </thead>
          <tbody>{vm.coachesRender(coaches)}</tbody>
        </table>
        </div>
        <div className="col-sm-5">
            <div className="container-fluid" style={{width: '100%', height: '100%'}}>
              
              <h3 className="text-center">Players Map</h3>

                <PlayersMap
                playerMapAddress={playerMapAddress}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${googleKey}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%`}} />}
                mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
            <br/>
            <br/>
            {addPlayerMap}
        </div>
        </div>
        
        {add_modal_elements}
      </div>
    );
  }
}
