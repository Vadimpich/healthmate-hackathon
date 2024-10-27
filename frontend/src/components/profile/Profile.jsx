import './profile.css';
import { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import SportImg from '../../assets/СпортДляМейн.png';
import api from "../../api/index.js";
import {useNavigate} from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('Мужской');
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.getUserProfile({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            setFirstName(data.first_name);
            setLastName(data.last_name);
            setAge(data.age);
            setGender(data.gender === 1 ? 'Мужской' : 'Женский');
            setHeight(data.height);
            setWeight(data.weight);
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !age || !height || !weight) {
            alert('Все поля должны быть заполнены');
            return;
        }
        try {
            const token = localStorage.getItem('accessToken');
            await api.updateUserProfile({
                first_name: firstName,
                last_name: lastName,
                age,
                gender: gender === 'Мужской' ? 1 : 2,
                height,
                weight
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Данные успешно сохранены");
            navigate('/main-page')
        } catch (err) {
            console.error('Ошибка при обновлении данных:', err);
        }
    };

    return (
        <Container className="back">
            <Row className="p-2 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Col} className='mb-3' controlId="formGridName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                placeholder="Введите ваше имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} className='mb-3' controlId="formGridLastName">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control
                                placeholder="Введите фамилию"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col} className='mb-3' controlId="formGridAge">
                                <Form.Label>Возраст</Form.Label>
                                <Form.Control
                                    placeholder="Введите ваш возраст"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridGender">
                                <Form.Label>Пол</Form.Label>
                                <Form.Select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option>Мужской</option>
                                    <option>Женский</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} className='mb-3' controlId="formGridHeight">
                                <Form.Label>Рост</Form.Label>
                                <Form.Control
                                    placeholder="Введите ваш рост"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group as={Col} className='mb-3' controlId="formGridWeight">
                                <Form.Label>Вес</Form.Label>
                                <Form.Control
                                    placeholder="Введите ваш вес"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </Form.Group>
                        </Row>
                        <Button variant="success" type="submit">
                            Сохранить
                        </Button>
                    </Form>
                </Col>
                <Col md={7} className="d-flex justify-content-center">
                    <img src={SportImg} alt="Пример" className="img-fluid w-50" />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;
