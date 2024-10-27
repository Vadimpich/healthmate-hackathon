import Header from "./components/header/Header.jsx";
import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Promo from "./components/promo/Promo.jsx";
import Footer from "./components/footer/Footer.jsx";
import MainPage from "./components/mainpage/MainPage.jsx";
import Profile from "./components/profile/Profile.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Activity from "./components/activity/Activity.jsx";
import Sleep from "./components/sleep/Sleep.jsx";
import Calories from "./components/food/Food.jsx";


function App() {

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header/>
                <Routes>
                    <Route path="/calories" element={<Calories/>}/>
                    <Route path="/sleep" element={<Sleep/>}/>
                    <Route path="/activity" element={<Activity/>}/>
                    <Route path="/" element={<Promo/>}/>
                    <Route path="/main-page" element={<MainPage/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
                <Footer/>
            </div>
        </Router>
    );

}

export default App
