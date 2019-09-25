import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import autoBind from 'react-autobind';
import {ToastsContainer, ToastsStore} from 'react-toasts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      localstatus: false,
      localresponse: [],
      lengthbefore: 0,
      notif: false,
      endpoint: "http://127.0.0.1:4001"
    };
    autoBind(this);
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
    socket.on("FromLocalAPI", data => this.setDataLocal(data));
  }
  setDataLocal(data){
    this.setState({ localresponse: data });
    if (this.state.lengthbefore !== data.length) {
      this.setState({ lengthbefore: data.length, notif: true });
      ToastsStore.success("Alert New User");
    }else{
      this.setState({ lengthbefore: data.length, notif: false });
    }
  }
  render() {
    const { response, localresponse } = this.state;
    return (
        <div className="container">
          <div style={{ textAlign: "center" }}>
            {response
                ? <p>
                  The temperature in Indonesia is: {response} °F
                </p>
                : <p>Loading Temperature in Indonesia...</p>}
          </div>
          <br/>
          <hr/>
          <h3>List User</h3>
          <hr/>
          <div style={{ textAlign: "center" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign: "left" }}>Email User</th>
                    <th style={{ textAlign: "left" }}>First Name</th>
                    <th style={{ textAlign: "left" }}>Last Name</th>
                  </tr>
                </thead>
              {localresponse
                ? 
                <tbody>
                  {localresponse.map((item, index) =>
                      <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ textAlign: "left" }}>{ item.email }</td>
                          <td style={{ textAlign: "left" }}>{ item.firstName }</td>
                          <td style={{ textAlign: "left" }}>{ item.lastName }</td>
                      </tr>
                  )}
                </tbody>
                : <tbody>
                    <tr>
                      <td colSpan="2">Loading Data User...</td>
                    </tr>
                </tbody>}
              </table>
          </div>
          <ToastsContainer store={ToastsStore}/>
        </div>
    );
  }
}
export default App;