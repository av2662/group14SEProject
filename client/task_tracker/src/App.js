import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homep from './components/pages/HomePage/Homep';
import Footer from './components/pages/Footer/Footer';
import Accordion from './components/Accordion';
import Login from './components/pages/LoginPage/login';
import Register from './components/pages/CreateAccountPage/CreateAccount';
import Calendar1 from './components/pages/CalendarPage/Calendar';
import MyHabits from './components/MyHabits';
import AdminView from './components/pages/AdminPage/AdminView';
import Rewards from './components/Rewards'; 

function App() {
  
  const isLogedIn = window.localStorage.getItem("isLogedIn");
  const user = window.localStorage.getItem("user"); 
  const isAdmin = window.localStorage.getItem("isAdmin");
  
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homep/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/sign-up" element={ <Register/> }></Route> 
        <Route path="/MyHabits" element={<PrivateRoute><MyHabits/></PrivateRoute>}></Route>
        <Route path="/Calendar" element={<PrivateRoute><Calendar1/></PrivateRoute>}></Route>
        <Route path="/Rewards" element={<PrivateRoute><Rewards/></PrivateRoute>}></Route>
        <Route path="/AdminPage" element={<PrivateAdminRoute><AdminView/></PrivateAdminRoute>}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
}
const PrivateRoute = ({ children }) => {
  const authed = window.localStorage.getItem("isLogedIn");
  
  return authed ? children : <Navigate to="/login" />;
}

const PrivateAdminRoute = ({ children }) => {
  const isLoggedIn = window.localStorage.getItem("isLogedIn");
  const isAdmin = window.localStorage.getItem("isAdmin");
  
  if (isLoggedIn === 'true') {
    if (isAdmin === 'true') {
      // User is logged in as admin, render the children (protected content)
      return children;
    } else {
      // User is logged in but not as admin, redirect to the Calendar page
      return <Navigate to="/calendar" />;
    }
  } else {
    // User is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }
}
export default App;
