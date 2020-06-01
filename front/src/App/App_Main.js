import React, { Component }  from "react";
import { Route, Link } from "react-router-dom";
import "./App.Main.css";
import ProfileUpdate from "./Player/Profile/profile.component";
// import RosterList from "./Team/Roster/roster-list.component";
import TeamMain from "./Team/Team_Main";
import StartNewTeam from "./StartNewTeam/StartNewTeam.component";
import { axiosClient } from "../axiosClient";

export default class ApplicationMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      teams: [],
      add_modal: {
        isOpen: false
      },
    };
  }

  componentDidMount() {
    const vm = this;
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    }

    let token = localStorage.getItem('token');

    if(token) {
      config.headers['x-auth-token'] = token;
    }
    axiosClient
      .get(`/users/teamdropdown`, config)
      .then(response => {
        const { user, teams } = response.data;
        user['name'] = user.firstName.concat(" ",user.lastName);
        
        this.setState({ user: user, teams: teams});
      })
      .catch(error => {
        console.log(error);
      });
  }

  render(){
    const vm = this;
    const {user, teams} = vm.state;

    let teamTags = teams.map(team=>{
      const href = `/app/team/roster/${team._id}`;
      return <Link to={href} className="list-group-item list-group-item-action bg-light" key={team._id}> Team {team.name}</Link>;
    });

    let teamRoutes = teams.map(team=>{
      const href = `/app/team/roster/${team._id}`;
      return <Route path={href} exact component={() => <TeamMain currentTeam={team} currentUser={user}/>} />;
      // return <Route path={href} exact component={() => <RosterList defaultTeam={team} currentUser={user}/>} />;
    });

    return (
      <div className="d-flex" id="wrapper">

      <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossOrigin="anonymous"
      />

      <div className="bg-light border-right " id="sidebar-wrapper">
        <div className="sidebar-heading"><strong>{user.name}</strong></div>
        <p>	&nbsp;	&nbsp;&lt;{user.email}&gt;</p>
        <div className="list-group list-group-flush">
          <a href="/app/team/startteam" className="list-group-item list-group-item-action bg-light"><strong>Start New Team</strong></a>
          {teamTags}

        </div>
      </div>
      <div id="page-content-wrapper">

        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom header-color">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <Link className="nav-link" to="/app/player/profile">Profile</Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="/">Log out</Link>
              </li>
            </ul>
          </div>
        </nav>

      <React.Fragment>
            <Route path="/app/player/profile" exact component={() => <ProfileUpdate user={user}/>}/>
            {teamRoutes}
            <Route path="/app/team/startteam" exact component={() => <StartNewTeam user={user}/>} />
      </React.Fragment>
      </div>

    </div>
    );
  }
}
