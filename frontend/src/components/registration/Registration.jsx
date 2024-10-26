import {Container, Row, Col, Form} from 'react-bootstrap';
import './registration.css'
import Button from "react-bootstrap/Button";
import spyImg from '../../assets/vecteezy_detective-face-3d-rendering-icon-illustration_29253743 1.svg'

function Registration() {
    return (
        <Container className="back">
            <Row className="g-0 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Введите ваш email" />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3" controlId="formGridFirstName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control placeholder="Введите ваше имя" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridLastName">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control placeholder="Введите вашу фамилию" />
                        </Form.Group>

                        <Row className="mb-2">
                            <Form.Group className="mb-3" controlId="formGridPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control type="password" placeholder="Придумайте пароль" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formGridRepeatPassword">
                                <Form.Label>Повторение пароля</Form.Label>
                                <Form.Control type="password" placeholder="Введите пароль повторно" />
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
