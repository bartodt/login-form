import React, { useState, useEffect } from "react";
import logo from "../assets/img/logo.svg";
import axios from "axios";
import Modal from "./Modal";

function App() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [initialState, setInitialState] = useState({
    user: "",
    password: "",
  });
  const [exchange, setExchange] = useState({
    price: "",
    date: "",
  });
  const [error, setError] = useState({
    error: false,
    content: "",
  });

  useEffect(() => {
    const websocket = new WebSocket(
      "ws://stream.tradingeconomics.com/?client=guest:guest"
    );
    const message = { topic: "subscribe", to: "EURUSD:CUR" };

    websocket.onopen = function (event) {
      let msg = JSON.stringify(message);
      websocket.send(msg);
    };

    websocket.onmessage = function (event) {
      let response = JSON.parse(event.data);
      if (response.hasOwnProperty("price")) {
        let timestamps = new Date(response.dt).toLocaleTimeString([], { timeZoneName: 'short' });

        setExchange({
          price: response.price,
          date: timestamps,
        });
      }
    };

    websocket.onerror = function () {
      console.log("web socket error");
    };
  }, []);

   function postData() {
    setLoading(true);
    axios
      .post("/login", initialState)
      .then((res) => {
        console.log("User logged.");
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 404)
          setError({ error: true, content: "The user does not exist." });
        else
          setError({
            error: true,
            content: "An error ocurred, please try again later.",
          });
        setLoading(false);
      });
  }

  function handleChange(event) {
    setInitialState({
      ...initialState,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (initialState.password === "")
      setError({ error: true, content: "Please, enter your password." });
    else if (initialState.user === "")
      setError({ error: true, content: "Please, enter your username." });
    else {
      setError({ error: false });
      postData();
    }
  }

  return openModal ? (
    <Modal closeModal={setOpenModal} />
  ) : (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleSubmit} className="sign-in-form">
            <img className="logo" src={logo} alt="logo" />
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                onChange={handleChange}
                value={initialState.user || ""}
                name="user"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                onChange={handleChange}
                value={initialState.password || ""}
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" disabled={loading} className={"btn solid"}>
              <p>LOGIN</p>
            </button>
            <div className="error">
            {error ? <p style={{ color: "red" }}>{error.content}</p> : null}
            </div>
         
            <div onClick={() => setOpenModal(true)} className="forgotpassword">
              <p>Forgot your password?</p>
            </div>
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h1>EUR/USD Exchange</h1>
            {exchange?.price ? (
              <>
                <p>
                  Price: <h2>{exchange.price}</h2>
                </p>
                <p>Last update: {exchange.date}</p>
              </>
            ) : (
              <p className="loading">Please wait</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
