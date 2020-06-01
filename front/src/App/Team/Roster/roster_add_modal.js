import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Alert,
  Label,
  UncontrolledTooltip
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Button, Collapse } from "react-bootstrap";
import { axiosClient } from "../../../axiosClient";

class RosterAddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_open: props.modal.isOpen,
      rosterData: {
        firstName: "",
        lastName: "",
        email: ""
      }
    };
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  handleModalClose(event) {
    const vm = this;
    vm.props.handleAddModalClose(event);
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

    let {teamId} = vm.props;

    const url = `/roster/${teamId}`;

    let { rosterData } = vm.state;

    axiosClient
      .post(url, rosterData)
      .then(function(response) {
        if (response.data) {
          // vm.props.setReloadComponentsFlag({offering_details: true, basic_info: true});
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
        isOpen={vm.state.modal_open}
        toggle={vm.handleModalClose}
        backdrop={"static"}
        centered={true}
      >
        <ModalHeader toggle={vm.handleModalClose} tag="h4">
          <strong>Add Roster</strong>
        </ModalHeader>
        <ModalBody>
          <AvForm onValidSubmit={vm.handleSubmit}>
            <AvField name="firstName" label="First Name" type="text" required onChange={vm.onChangeHandler}/>
            <AvField name="lastName" label="Last Name" type="text" required onChange={vm.onChangeHandler}/>
            <AvField name="email" label="Email Address" type="email" required onChange={vm.onChangeHandler}/>
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

export default RosterAddModal;
