import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logoImg from '../../assets/activity.svg';
import './header.css';
import {Link, useNavigate} from 'react-router-dom';
import api from "../../api/index.js";
import {motion} from 'framer-motion';
import UserImg from '../../assets/Social Media Icons (Community)/user.svg'
import MainImg from '../../assets/Social Media Icons (Community)/activity.svg'
import LogOutImg from '../../assets/Social Media Icons (Community)/log-out.svg'



function Header() {
    // Проверяем, есть ли токен доступа в localStorage
    const isLoggedIn = localStorage.getItem('accessToken') !== null;
    const navigate = useNavigate(); // Инициализируем navigate

    const handleLogout = async () => {
        //localStorage.removeItem('accessToken');
        //localStorage.removeItem('refreshToken');
        const data = {'refresh': localStorage.getItem('refreshToken')};
        await api.logoutUser(data)
        // Перенаправляем пользователя на страницу входа или главную страницу
        navigate('/'); // Укажите нужный путь для перенаправления
    };
    return (

        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{amount: 0.2, once: true}}
        >

            <Navbar expand="lg" className="d-flex justify-content-between sticky-header">
                <Container fluid className="d-flex justify-content-between px-5">

                    <Navbar.Brand as={Link} to='/'>

                        <motion.div
                            custom={1}
                            variants={logoAnimation}
                            className="d-flex align-items-center">
                            <motion.img src={logoImg} alt='Logo'/>
                            <text>HealthyMate</text>
                        </motion.div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarScroll"/>
                    <div className="d-flex gap-2">
                        {isLoggedIn ? (
                            <>
                                <motion.div
                                    custom={1}
                                    variants={buttonAnimation}
                                >
                                    <Button variant="success" className="custom-button d-flex align-items-center gap-1"
                                            as={Link} to='/profile'>

                                        <img src={UserImg} alt={'UserImg'}/>
                                        Мои данные
                                    </Button>
                                </motion.div>
                                <motion.div
                                    custom={2}
                                    variants={buttonAnimation}>
                                    <Button variant="success" className="custom-button d-flex align-items-center gap-1"
                                            as={Link} to='/main-page'>
                                        <img src={MainImg} alt={"MainImg"}/>
                                        Личный кабинет
                                    </Button>
                                </motion.div>
                                <motion.div
                                    custom={3}
                                    variants={buttonAnimation}>
                                    <Button variant="danger" onClick={handleLogout}
                                            className="logout-button custom-button d-flex align-items-center gap-1">
                                        <img src={LogOutImg} alt={"logOutImg"} className={''}/>
                                        Выйти
                                    </Button>
                                </motion.div>


                            </>
                        ) : (
                            <>
                                <Button variant="success custom-button" as={Link} to='/login'>
                                    Войти
                                </Button>
                                <Button variant="success" className="custom-button" as={Link} to='/registration'>
                                    Регистрация
                                </Button>
                            </>
                        )}
                    </div>
                </Container>
            </Navbar>
        </motion.div>
    );
}

export default Header;

export const logoAnimation = {
    hidden: (custom) => ({
        opacity: 0,

    }),
    visible: {
        opacity: 1,

        transition: {
            duration: 0.8,
            ease: "easeInOut"
        }
    }
};

export const buttonAnimation = {
    hidden: {
        opacity: 0,

    },
    visible: (custom) => ({
        opacity: 1,

        transition: {
            duration: 0.8,
            ease: "easeInOut",
            delay: custom * 0.2,
        }
    })
};
