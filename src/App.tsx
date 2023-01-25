import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Chat from "./Pages/Chat.jsx";
import ChatProvider from './Context/ChatProvider.js';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
