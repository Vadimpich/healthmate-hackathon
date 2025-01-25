import { Container, Row, Col, Form } from 'react-bootstrap';
import './registration.css';
import Button from 'react-bootstrap/Button';
import spyImg from '../../assets/vecteezy_detective-face-3d-rendering-icon-illustration_29253743 1.svg';
import { useState } from 'react';
import api from '../../api'; // Импортируйте ваш API
import {Link, useNavigate} from "react-router-dom";

function Registration() {

    const navigate = useNavigate();
    // Состояние для формы
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(''); // Состояние для ошибок

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы

        // Простейшая валидация
        if (password !== repeatPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            // Вызываем API для регистрации
            const userData = {
                email,
                username,
                first_name: firstName,
                last_name: lastName,
                password,
            };
            await api.registerUser(userData);
            // Успешная регистрация, можно перенаправить пользователя или показать уведомление
            alert('Регистрация прошла успешно, проверьте почту для подтверждения учётной записи!');
            navigate('/login');
        } catch (err) {
            // Обработка ошибок, полученных от API
            setError(err.response?.data?.detail || 'Произошла ошибка при регистрации');
        }
    };

    return (
        <Container className="back p-4">
            <Row className="g-0 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form onSubmit={handleSubmit}>
                        {error && <p className="text-danger">{error}</p>} {/* Показываем ошибку, если есть */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Введите ваш email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group as={Col} className='mb-3' controlId="formGridUsername">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Введите ваш логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGridFirstName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                placeholder="Введите ваше имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridLastName">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                placeholder="Введите вашу фамилию"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Row className="mb-2">
                            <Form.Group className="mb-3" controlId="formGridPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Придумайте пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formGridRepeatPassword">
                                <Form.Label>Повторение пароля</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Введите пароль повторно"
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <Button variant="success" type="submit">
                            Зарегистрироваться
                        </Button>
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

export default Registration;
