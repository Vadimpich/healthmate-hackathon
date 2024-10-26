import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logoImg from '../../assets/activity.svg'
import './header.css'
import { Link } from 'react-router-dom';

function Header() {
    return (

        <Navbar expand="lg" className="bg-body-tertiary d-flex justify-content-between">
            <Container fluid className="d-flex justify-content-between">
                <Navbar.Brand as={Link} to='/'>
                    <div className="d-flex align-items-center">
                        <img src={logoImg} alt='Logo'/>
                        <text>HealthyMate</text>
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <div className="d-flex gap-2">
                    <Button variant="success custom-button" as={Link} to='/login'>Войти</Button>
                    <Button variant="success" className="custom-button" as={Link} to='/registration'>Регистрация</Button>
                </div>

            </Container>
        </Navbar>
    );
}

export default Header;
