import '../LoginRegister.css'
import React, { Component } from 'react'
import axios,{setAuthToken} from '../../../axios-auth'
export default class LogIn extends Component {
  constructor(props){
    super(props);
  }
  state = {
    userName: "",
    password: ""
  }
  ChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  }
  ChangePassword = (e) => {
    this.setState({ password: e.target.value });
  }
  Submit = (e) => {
    e.preventDefault();
    const obj = {
      userName: this.state.userName,
      password: this.state.password
    }
    axios
    .post( "/api/user/login", obj)
    .then(data => {
       window.localStorage.setItem("x-auth-token", data.data.result.authToken);
       setAuthToken(data.data.result.authToken);
       this.props.history.push("/");
    }).catch(e => {
        alert("pass word or user name not valid");
    });
    
  }
  render() {
    return (
      <form className="email-login">
        <div className="u-form-group">
          <input type="text" onChange={this.ChangeUserName} placeholder="User Name" />
        </div>
        <div className="u-form-group">
          <input type="password" onChange={this.ChangePassword} placeholder="Password" />
        </div>
        <div className="u-form-group"  >
          <button onClick={this.Submit} >Log in</button>
        </div>
      </form>
    );
  }
}