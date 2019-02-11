
import '../LoginRegister.css'
import React, { Component } from 'react'
import axios, { setAuthToken } from '../../../axios-auth'
export default class Register extends Component {
    state = {
        userName: "",
        password: "",
        secondPassword: "",
        name: "",
       
    }
    passwordChange = (e) => {
        this.setState({ password: e.target.value });
    }

    secondPasswordChange = (e) => {
        this.setState({ secondPassword: e.target.value });
    }

    userNameChange = (e) => {
        this.setState({ userName: e.target.value });
    }
    nameChange = (e) => {
        this.setState({ name: e.target.value });
    }
    submit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.secondPassword) {
            return alert("reEnter pass word");
        }
        const obj = {
            name: this.state.name,
            userName: this.state.userName,
            password: this.state.password,
        }
       debugger;
        axios
            .post("/api/user", obj)
            .then(res => {
                window.localStorage.setItem("x-auth-token", res.data.result.authToken);
                setAuthToken(res.data.result.authToken);
                this.props.history.push("/");
            }).catch(e => {
                console.error("some thing get error");
            });
    }
    render() {
        return (
            <form className="email-signup">
                <div className="u-form-group">
                    <input type="text" onChange={this.nameChange} placeholder="Name" />
                </div>
                <div className="u-form-group">
                    <input type="text" onChange={this.userNameChange} placeholder="User Name" />
                </div>
                <div className="u-form-group">
                    <input type="password" onChange={this.passwordChange} placeholder="Password" />
                </div>
                <div className="u-form-group">
                    <input type="password" onChange={this.secondPasswordChange} placeholder="Confirm Password" />
                </div>
                <div className="u-form-group">
                    <button onClick={this.submit} >Sign Up</button>
                </div>
            </form>
        );
    }
}

