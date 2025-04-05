import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.jsx";
import DataProvider from "./context/DataContext";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <DataProvider>
      <App />
    </DataProvider>
  </MantineProvider>
);
