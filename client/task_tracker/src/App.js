import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homep from './components/pages/HomePage/Homep';
import Footer from './components/pages/Footer/Footer';
import Accordion from './components/Accordion';
import Login from './components/pages/LoginPage/login';
import Register from './components/pages/CreateAccountPage/CreateAccount';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homep/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/sign-up" element={ <Register/> }></Route> 
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
