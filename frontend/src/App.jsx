import Header from "./components/header/Header.jsx";
// import Promo from "./components/promo/Promo.jsx";
import Login from "./components/login/Login.jsx";
import Registration from "./components/registration/Registration.jsx";
import Promo from "./components/promo/Promo.jsx";
import Footer from "./components/footer/Footer.jsx";
import MainPage from "./components/mainpage/MainPage.jsx";
import Profile from "./components/profile/Profile.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Header/>
                <Routes>
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
