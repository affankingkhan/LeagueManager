import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from './register.jsx';
import Login from './login.jsx';
import "./App.scss";


export default class SignupLoginMain extends Component{

  constructor(props){
    super(props);
    this.state ={
      isLogin: true
    }
    this.changeState = this.changeState.bind(this);
  }

  changeState (){
    const vm = this;
    const {isLogin} = vm.state;
    if(isLogin){
      vm.rightSide.classList.remove('right');
      vm.rightSide.classList.add('left');
    }else{
      vm.rightSide.classList.remove('left');
      vm.rightSide.classList.add('right');
    }

    vm.setState(prevState =>({isLogin: !prevState.isLogin}));

  }


  render(){
    const vm = this;
    const {isLogin} = vm.state;
    const current = isLogin ? "Register" : "Login";
    const currentActive = isLogin ? "Login" : "Register";

    return(
      <div className='app'>
        <div className='login'>
          <div className="container">
            {isLogin && <Login containerRef={(ref) => this.current = ref}/>}
            {!isLogin && <Register containerRef={(ref) => this.current = ref}/>}
          </div>
          <RightSide current={current} currentActive={currentActive} containerRef={ref => this.rightSide = ref} onClick={vm.changeState}/>
        </div>
      </div>

    )
  }
}

const RightSide = props => {
  return(
    <div className="right-side right" ref={props.containerRef} onClick={props.onClick}>
      <div className="inner-container">
        <div className='text'>{props.current}</div>
      </div>
    </div>
  )
}
