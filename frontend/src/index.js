import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import MaximizerApp from "./MaximizerApp";
import reportWebVitals from "./reportWebVitals";

// The browser reports this harmless warning (often from extensions) as a window
// error, and the dev server's overlay shows it as a crash. Capture listeners on
// window run before the overlay's, so this keeps it out of the overlay.
if (process.env.NODE_ENV === "development") {
  window.addEventListener(
    "error",
    (e) => {
      if (e.message?.startsWith("ResizeObserver loop")) {
        e.stopImmediatePropagation();
      }
    },
    true
  );
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MaximizerApp />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
