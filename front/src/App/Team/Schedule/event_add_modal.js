import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { AvForm, AvField, AvRadioGroup, AvRadio} from "availity-reactstrap-validation";
import { Button} from "react-bootstrap";
import { axiosClient } from "../../../axiosClient";
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from 'moment'


class EventAddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: this.props.addModal.isOpen,
      selected_date: new Date(),
      eventData: {
        type: "",
        opponent: "",
        homeOrAway: "",
        title: "",
        date: '',
        time: moment().format('LT'),
        duration: "TBD",
        notes: "",
        teamId: this.props.teamId,
      }
    };
    this.handleModalClose = this.handleModalClose.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleModalClose(event) {
    const vm = this;
    vm.props.handleAddModalClose(event);
  }

  onChangeHandler(e) {
    const vm = this;
    e.persist()
    const {name, value} = e.target;
    let eventData  = {...vm.state.eventData};
    eventData[name] = value;

    vm.setState({eventData});
}
  onDateChange(date){
      const vm = this;
      let dateString = new Intl.DateTimeFormat('en-US').format(date)
      let {selected_date} = vm.state;
      selected_date = date;
      let eventData = {...vm.state.eventData};
      eventData.date = dateString;
      vm.setState({eventData, selected_date})

  }
  onTimeChange(time){
      const vm = this;
      let eventData = {...vm.state.eventData};
      eventData.time = time.format("hh:mm a");
      vm.setState({eventData})
    //   console.log(vm.state.eventData);
  }

  handleSubmit(event, values) {
    const vm = this;
    event.persist();
    const url = `/schedule/add`;
    let { eventData } = vm.state;

    axiosClient
      .post(url, eventData)
      .then(function(response) {
        if (response.data) {
          vm.handleModalClose();
          window.location.reload();
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const vm = this;
    return (
      <Modal
        isOpen={vm.state.modalOpen}
        toggle={vm.handleModalClose}
        backdrop={"static"}
        centered={true}
      >
        <ModalHeader toggle={vm.handleModalClose} tag="h4">
          <strong>Add Event</strong>
        </ModalHeader>
        <ModalBody>
          <AvForm onValidSubmit={vm.handleSubmit}>
            <label htmlFor='type'>Type</label>
            <AvRadioGroup inline name="type" required onChange={vm.onChangeHandler}>
                <AvRadio label="Game" value="Game" />
                <AvRadio label="Practice" value="Practice" />
                <AvRadio label="Scrimmage" value="Scrimmage" />
                <AvRadio label="Tournament" value="Tournament" />
            </AvRadioGroup>
            <label htmlFor='homeOrAway'>Home/Away</label>
            <AvRadioGroup inline name="homeOrAway" required onChange={vm.onChangeHandler}>
                <AvRadio label="Home" value="Home" />
                <AvRadio label="Away" value="Away" />
            </AvRadioGroup>
            <AvField name="opponent" label="Opponent" type="text" onChange={vm.onChangeHandler}/>
            <AvField name="title" label="Title" type="text" required onChange={vm.onChangeHandler}/>
            <label htmlFor='date'>Date</label>
            &nbsp;&nbsp;
            <DatePicker
                name='date'
                selected={vm.state.selected_date}
                onChange={vm.onDateChange}
                dateFormat="yyyy/MM/dd"
            />
            <br/>
            <br/>
            <label htmlFor='time'>Time</label>
            &nbsp;&nbsp;
            <TimePicker
                name='time'
                selected={vm.state.eventData.time}
                onChange={vm.onTimeChange}
                use12Hours={true}
                showSecond={false}
                required
            />

            <AvField type="select" name="duration" label="Duration" onChange={vm.onChangeHandler} default='TBD'>
                <option>TBD</option>
                <option>Full Day</option>
                <option>00:30</option>
                <option>01:00</option>
                <option>01:30</option>
                <option>02:00</option>
                <option>02:30</option>
                <option>03:00</option>
            </AvField>
            <AvField name="notes" label="Notes" type="text" onChange={vm.onChangeHandler}/>
            <button type="submit" className="btn btn-primary">Save</button>
            &nbsp;&nbsp;
            <Button variant="secondary" onClick={vm.handleModalClose}>
              Cancel
            </Button>
          </AvForm>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    );
  }
}

export default EventAddModal;
