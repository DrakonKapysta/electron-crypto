import * as React from "react";
import App from "./App.jsx";
import "./index.css";
const { createRoot } = require("react-dom/client");

const root = createRoot(document.getElementById("root"));
root.render(<App />);
