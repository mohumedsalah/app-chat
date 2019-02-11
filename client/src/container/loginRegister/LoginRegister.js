import './LoginRegister.css'
import React, { Component } from 'react'
import LogIn from './login/Login'
import Register from './register/Register'
import axios, { setAuthToken } from '../../axios-auth'
const apihost = "localhost:8000/api"
export default class login extends Component {
    state = {
        login: true,
        loginActive: "active",
        registerActive: ""
    }
    async componentDidMount() {
        try {

            const token = window.localStorage.getItem("x-auth-token");
            setAuthToken(token);
            if (token) {
                const user = await axios.get("/api/user/me/" + token);
                if (user.data.result._id) {
                    this.props.history.push("/");
                }
            }

        } catch (e) {

        }
    }
    ChangeLogIn = () => {
        this.setState({ login: true, loginActive: "active", registerActive: "" });
    }
    ChangeRegister = () => {
        this.setState({ login: false, loginActive: "", registerActive: "active" });
    }
    render() {
        let Container = this.state.login ? <LogIn {...this.props} /> : <Register {...this.props} />
        return (
            <div className="login-box">
                <div className="lb-header">
                    <a onClick={this.ChangeLogIn} className={this.state.loginActive} >Login</a>
                    <a onClick={this.ChangeRegister} className={this.state.registerActive} >Sign Up</a>
                    {Container}
                </div>
            </div>
        );
    }
}