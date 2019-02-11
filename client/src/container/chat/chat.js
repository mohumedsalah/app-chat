import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';
import axios, { setAuthToken } from '../../axios-auth';
import { withRouter } from 'react-router-dom';
import './chat.css'
class chat extends Component {
  constructor(props) {
    super(props);

    this.props.socket.on('hello', (res) => {
      const users = [];
      res.forEach(element => {
        users.push({ id: element.id, name: element.name, messagesRecived: [], messagesSend: [] });
      });
      this.setState({ users });
    });
    this.props.socket.on('disconnectOne', (id) => {
      const users = [...this.state.users];
      var index = users.findIndex(item => item.id === id)
      users.splice(index, 1);
      this.setState({ users });
    })
    this.state = {
      users: [
        {
          name: "salah",
          id: 1,
          messagesRecived: [
            { content: "hello", date: new Date() },
            { content: "mohamed", date: new Date() },
          ],
          messagesSend: [
            { content: "find", date: new Date() },
            { content: "find y salah", date: new Date() }],
        },
        {
          name: "omar",
          id: 2,
          messagesRecived: [
            { content: "hello", date: new Date() },
            { content: "mohamed", date: new Date() },
          ],
          messagesSend: [
            { content: "find", date: new Date() },
            { content: "find y omar", date: new Date() }],
        },
      ], messagesViews: [
      ],
      currentUserName: "",
      currentUserId: 0,
      inputMessage: "",
      userNameSelf :""
    };
  }
  async componentDidMount() {
    const token = window.localStorage.getItem('x-auth-token');
    setAuthToken(token);
    try {
      if (!token) {
        this.props.history.push('/join');
      }
      const user = await axios.get('/api/user/me/' + token);
      if (!user.data.result._id) {
        this.props.history.push('/join');
      }
      this.setState({ userNameSelf: user.data.result.name});
      this.props.socket.emit('current', user.data.result);
      this.props.socket.on('newOneComming', (user) => {
        const users = this.state.users;
        users.push({ name: user.name, id: user._id, messagesRecived: [], messagesSend: [] });
        this.setState(users);
      });
      this.props.socket.on('newMessageComming', (message) => {

        const users = this.state.users;
        debugger;
        const user = users.find(e => e.id === message.from);
        user.messagesRecived.push({ content: message.content, date: new Date() });
        this.setState({ users });
        this.showing(this.state.currentUserId);
      })
    } catch (e) {
      this.props.history.push('/join');
    }

  }
  showing = (id) => {
    if (id === 0) {
      return;
    }
    let viewingMessages = [];
    const users = [...this.state.users];
    const user = users.find(obj => obj.id === id);
    user.messagesRecived.forEach(element => {
      viewingMessages.push({ content: element.content, self: false, date: element.date });
    });
    user.messagesSend.forEach(element => {
      viewingMessages.push({ content: element.content, self: true, date: element.date });
    });
    viewingMessages.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
    this.setState({ messagesViews: viewingMessages, currentUserId: id, currentUserName: user.name });
  }
  submit = () => {
    if (this.state.currentUserId === 0) {
      alert("can't send this message user of line select another one");
      return;
    }
    const users = [...this.state.users];
    const user = users.find(obj => obj.id === this.state.currentUserId);
    user.messagesSend.push({ date: new Date(), self: true, content: this.state.inputMessage });
    this.setState({ users, inputMessage: "" });
    this.showing(this.state.currentUserId);
    const obj = { to: this.state.currentUserId, content: this.state.inputMessage };
    this.props.socket.emit("sendMessage", obj);

  }
  changeMessage = (e) => {
    this.setState({ inputMessage: e.target.value });
  }
  logOut = () =>{
    window.localStorage.setItem('x-auth-token', null);
    this.props.history.push('/join');
  }
  render() {

    const onlineUsers = this.state.users.map(m => (
      <li className="clearfix" key={m.id} >
        <div className="about">
          <div className="name">
            <a onClick={() => this.showing(m.id)} >{m.name}</a></div>
          <div className="status">
            <i className="fa fa-circle online"></i>{m.id}
          </div>
        </div>
      </li>
    ));
    const userName = <div className="chat-num-messages">{this.state.currentUserName}</div>

    const currentMessages = this.state.messagesViews.map((e, inx) => e.self ?
      <li key={inx} className="clearfix">
        <div className="message-data align-right">
          <span className="message-data-time" >{e.date.toLocaleTimeString()}</span> &nbsp; &nbsp;
            <span className="message-data-name" >Me</span> <i className="fa fa-circle me"></i>

        </div>
        <div className="message other-message float-right">
          {e.content}
        </div>
      </li>

      :
      <li key={inx} >
        <div className="message-data">
          <span className="message-data-name"><i className="fa fa-circle online"></i> {this.state.currentUserName}</span>
          <span className="message-data-time">{e.date.toLocaleTimeString()}</span>
        </div>
        <div className="message my-message">
          {e.content}
        </div>
      </li>

    )



    return (
      <div className="container clearfix">
        <div> <h4>Hello : {this.state.userNameSelf}</h4>  <a onClick = {() =>this.logOut()} > <h3>Log Out </h3> </a></div>
        <div className="people-list" id="people-list">
          <div className="search">
            <input type="text" placeholder="search" />
            <i className="fa fa-search"></i>
          </div>
          <ul className="list ">
            {onlineUsers}
          </ul>
        </div>

        <div className="chat">
          <div className="chat-header clearfix">
            <div className="chat-about">
              <div className="chat-with">Chat with </div>
              {userName}
            </div>
            <i className="fa fa-star"></i>
          </div>

          <div className="chat-history">
            <ul ref={(el) => { this.messagesEnd = el; }} >



              {currentMessages}


            </ul>

          </div>

          <div disabled className="chat-message clearfix">
            <textarea
              value={this.state.inputMessage}
              onChange={this.changeMessage.bind(this)}
              name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3"></textarea>

            <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
                <i className="fa fa-file-image-o"></i>

            <button onClick={() => this.submit()} >Send</button>
          </div>

        </div>

      </div>




    );
  }
}

export default withRouter(socketConnect(chat));