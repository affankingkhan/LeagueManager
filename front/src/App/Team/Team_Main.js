import React, { Component } from "react";
import { Tabs,Tab } from "react-bootstrap";
import RosterList from "./Roster/roster-list.component";
import ScheduleList from './Schedule/event-list.component';
import { axiosClient } from "../../axiosClient";

export default class TeamMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
        teamName: "",
        players: [],
        coaches: [],
        playerMapAddress: []
    };

  }


componentDidMount() {
    const vm = this;
    const {currentTeam} = vm.props;

    axiosClient
      .get(`/roster/${currentTeam._id}`)
      .then(response => {

        const {team, playerMapAddress} = response.data;

        vm.setState({ teamName: team.name, players: team.players, coaches: team.coaches, playerMapAddress:playerMapAddress });
      })
      .catch(error => {
        console.log(error);
      });
}

  render() {
    const vm = this;
    const {currentTeam, currentUser} = vm.props;
    const {teamName,players,coaches,playerMapAddress} = vm.state;

    return (
        <div>
        <h2 className="text-center" style={{'background-color': 'coral'}}>Team {teamName}</h2>
        <Tabs className="justify-content-center" defaultActiveKey="roster">
          <Tab eventKey="roster" title="Roster" mountOnEnter={true}>
            <RosterList defaultTeam={currentTeam} currentUser={currentUser}
                players={players} coaches={coaches} playerMapAddress={playerMapAddress}
            />
          </Tab>

          <Tab eventKey="schedule" title="Schedule" mountOnEnter={true}>
            <ScheduleList currentUser={currentUser} currentTeam={currentTeam}/>
          </Tab>
        </Tabs>
        </div>
    );
  }

}
