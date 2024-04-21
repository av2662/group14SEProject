import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homep from './components/pages/HomePage/Homep';
import Footer from './components/pages/Footer/Footer';
import Accordion from './components/Accordion';
import Login from './components/pages/LoginPage/login';
import Register from './components/pages/CreateAccountPage/CreateAccount';
import Calendar1 from './components/pages/CalendarPage/Calendar';
//import Monthly from './components/pages/MonthlyPage/monthly';
import MyHabits from './components/MyHabits';
function App() {
  
  const isLogedIn = window.localStorage.getItem("isLogedIn");
  const user = window.localStorage.getItem("user"); 
  console.log(isLogedIn + "hello");
  console.log(user);
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homep/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/sign-up" element={ <Register/> }></Route> 
        <Route path="/MyHabits" element={<MyHabits/>}></Route>
        <Route path="/Calendar" element={<Calendar1/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
