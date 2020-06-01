import React, { Component } from "react";
import { axiosClient } from "../../../axiosClient";
import EventAddModal from "./event_add_modal";
import EventEditModal from "./event_edit_modal";

export default class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        currentUser: this.props.currentUser,
        currentTeam: this.props.currentTeam,
        addModal: {
            isOpen: false
        },
        editModal: {
            event:[],
            isOpen: false
        },
        pastEvents: [],
        futureEvents:[]
    };
    this.getAllEvents = this.getAllEvents.bind(this);
    this.handleAddModalOpen = this.handleAddModalOpen.bind(this);
    this.handleAddModalClose = this.handleAddModalClose.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);

  }

  componentDidMount() {
      const vm = this;
      vm.getAllEvents();
  }
  


  getAllEvents(){
      const vm = this;

      const url = '/schedule/';
      const config = {
          teamId: vm.props.currentTeam._id
      }
      axiosClient.post(url,config)
      .then(function(response) {
        if (response.data) {
            let {data} = response;
            vm.setState({
                pastEvents: data.pastEvents ? data.pastEvents : [],
                futureEvents: data.futureEvents ? data.futureEvents : []
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });


  }

  handleAddModalOpen() {
    const vm = this;
    let {addModal} = vm.state;
    addModal.isOpen = true;
    vm.setState(addModal);
  }

  handleAddModalClose(event) {
    const vm = this;
    let {addModal} = vm.state;
    addModal.isOpen = false;
    vm.setState(addModal);
  }

  openEditModal (currentEvent){
    const vm = this;
    let {editModal} = vm.state;
    editModal.isOpen = true;
    editModal.event = currentEvent;
    vm.setState({editModal});
}
  closeEditModal(){
    const vm = this;
    let {editModal} = vm.state;
    editModal.isOpen = false;
    editModal.event = [];
    vm.setState({editModal});
}





  render(){
      const vm = this;
      let addModal = '';
      if(vm.state.addModal.isOpen){
          addModal = <EventAddModal handleAddModalClose={vm.handleAddModalClose} teamId={vm.props.currentTeam._id} addModal={vm.state.addModal}/>
      }
      let editModal = '';
      if(vm.state.editModal.isOpen){
          editModal = <EventEditModal handleModalClose={vm.closeEditModal}  editModal={vm.state.editModal}/>
      }

      let futureEventsRow = futureTableRowRender(vm.state.futureEvents, vm);
      let pastEventsRow = pastTableRowRender(vm.state.pastEvents);

      return (
        <div className='container-fluid'>
            <h3 className="text-center">Future Events</h3>
            <table className="table">
                <thead className="thead-light text-center">
                    <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Opponent</th>
                        <th>Home/Away</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {futureEventsRow}
                </tbody>
            </table>
            <button className="btn btn-primary" type="button" onClick={vm.handleAddModalOpen} >Add Event</button>

            <h3 className="text-center">Past Events</h3>
            <table className="table">
                <thead className="thead-light text-center">
                    <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Opponent</th>
                        <th>Home/Away</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {pastEventsRow}
                </tbody>
            </table>
            {addModal}
            {editModal}


        </div>


      )
  }
}


const pastTableRowRender = events =>{

    var ret = events.map(event => {
        return(
            <tr className='text-center' key={event._id}>
                <td>{event.type}</td>
                <td>{event.title}</td>
                <td>{event.opponent ? event.opponent : '--'}</td>
                <td>{event.homeOrAway}</td>
                <td>{event.date.substring(0, 10)}</td>
                <td>{event.time}</td>
                <td>{event.duration}</td>
                <td>{event.notes ? event.notes : '--'}</td>
            </tr>

        )

    })
    return ret;

}

const futureTableRowRender = (events, vm) =>{

    var ret = events.map(event => {
        return(
            <tr className='text-center' key={event._id}>
                <td>{event.type}</td>
                <td>{event.title}</td>
                <td>{event.opponent ? event.opponent : '--'}</td>
                <td>{event.homeOrAway}</td>
                <td>{event.date.substring(0, 10)}</td>
                <td>{event.time}</td>
                <td>{event.duration}</td>
                <td>{event.notes ? event.notes : '--'}</td>
                <td>
                    <button key={event._id+'btnEdit'} className="btn btn-warning mr-1" onClick={()=>vm.openEditModal(event)}>Edit</button>
                </td>
            </tr>

        )

    })
    return ret;

}