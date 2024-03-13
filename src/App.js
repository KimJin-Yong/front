import "./App.css";
import "./styles.css";
import UploadForm from './components/UploadForm';
import Chat from "./pages/chat";

import { Routes, Route, BrowserRouter } from "react-router-dom";

export default function App() {

  return (
    <div className="App">
      <h1>
        <a href="/"> Paper QA with Graph </a>
      </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/chatbot" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
// paperId, query -> query only