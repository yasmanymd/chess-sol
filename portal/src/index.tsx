import * as React from "react";
import * as ReactDOM from "react-dom";
import * as io from "socket.io-client";
import App from "./App";
import "./index.css";

const socket = io("http://localhost:50000/", { transports: ["polling"] });
window["io"] = {};
window["io"].socket = socket;

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
