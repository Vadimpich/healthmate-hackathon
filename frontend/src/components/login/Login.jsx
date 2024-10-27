import { Container, Row, Col, Form } from 'react-bootstrap';
import './login.css';
import '../promo/promo.css';
import Button from 'react-bootstrap/Button';
import spyImg from '../../assets/vecteezy_detective-face-3d-rendering-icon-illustration_29253743 1.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import api from '../../api'; // Импортируйте ваш API

function Login() {
    const navigate = useNavigate(); // Создаем экземпляр навигатора
    const [username, setUsername] = useState(''); // Состояние для email
    const [password, setPassword] = useState(''); // Состояние для пароля
    const [error, setError] = useState(''); // Состояние для ошибок

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        try {
            // Вызываем API для логина
            const userData = {
                username,
                password,
            };
            await api.loginUser(userData); // Предполагаем, что у вас есть метод loginUser
            // Успешный логин, перенаправляем на главную страницу или другую
            navigate('/main-page'); // Здесь можно указать нужный маршрут
        } catch (err) {
            // Обработка ошибок, полученных от API
            setError(err.response?.data?.detail || 'Произошла ошибка при логине');
        }
    };

    return (
        <Container className="back">
            <Row className="g-0 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form onSubmit={handleSubmit}>
                        {error && <p className="text-danger">{error}</p>} {/* Показываем ошибку, если есть */}
                        <Form.Group className="mb-3" controlId="formGridUsername">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Введите ваш логин или почту"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} // Обновляем состояние
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите ваш пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Обновляем состояние
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" id="formGridCheckbox">
                            <a href="/registration" className="text-decoration-none">Нет аккаунта? Так создай его!</a>
                        </Form.Group>
                        <div>
                            <Button variant="success" type="submit" className="justify-content-center custom-button">
                                Войти
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col md={7} className="d-flex justify-content-center">
                    <img
                        src={spyImg}
                        alt="Пример"
                        className="img-fluid img-width" // Класс для адаптивного изображения
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
