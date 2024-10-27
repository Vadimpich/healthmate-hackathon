import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logoImg from '../../assets/activity.svg';
import './header.css';
import {Link, useNavigate} from 'react-router-dom';

function Header() {
    // Проверяем, есть ли токен доступа в localStorage
    const isLoggedIn = localStorage.getItem('accessToken') !== null;
    const navigate = useNavigate(); // Инициализируем navigate

    const handleLogout = () => {
        // Очищаем токены и другие данные
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Перенаправляем пользователя на страницу входа или главную страницу
        navigate('/'); // Укажите нужный путь для перенаправления
    };
    return (
        <Navbar expand="lg" className="bg-body-tertiary d-flex justify-content-between">
            <Container fluid className="d-flex justify-content-between px-5">
                <Navbar.Brand as={Link} to='/'>
                    <div className="d-flex align-items-center">
                        <img src={logoImg} alt='Logo'/>
                        <text>HealthyMate</text>
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <div className="d-flex gap-2">
                    {isLoggedIn ? (
                        <>
                            <Button variant="success" className="custom-button" as={Link} to='/profile'>
                                Мои данные
                            </Button>
                            <Button variant="success" className="custom-button" as={Link} to='/main-page'>
                                Личный кабинет
                            </Button>
                            <Button variant="danger" onClick={handleLogout} className="custom-button">
                                Выйти
                            </Button>
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
    );
}

export default Header;
