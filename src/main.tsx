import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/";
import ReactDOM from "react-dom/client";
import SSRProvider from "react-bootstrap/SSRProvider";
import "./index.scss";
import { BasePattern } from "./BasePattern";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <SSRProvider>
        <BrowserRouter>
          <BasePattern />
        </BrowserRouter>
      </SSRProvider>
    </Provider>
  </React.StrictMode>
);
