import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Success from "./component/Success/Success";
import Checkout from "./component/Checkout/Checkout";
import Login from "./component/Login/Login";
import UserProvider from "./context/UserProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <UserProvider>
    <Router>
      <ToastContainer position="bottom-center" />
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/" Component={Checkout} />
        <Route path="/success" Component={Success} />
      </Routes>
    </Router>
    </UserProvider>
  );
}
