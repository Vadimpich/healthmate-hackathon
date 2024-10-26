import {Container, Row, Col, Form} from 'react-bootstrap';
import '././login.css'
import '../promo/promo.css'
import Button from "react-bootstrap/Button";
import spyImg from '../../assets/vecteezy_detective-face-3d-rendering-icon-illustration_29253743 1.svg'

function Login() {
    return (
        <Container className="back">
            <Row className="g-0 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form>
                        <Form.Group className="mb-3" controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Введите ваш email"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGridPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" placeholder="Введите ваш пароль"/>
                        </Form.Group>


                        <Form.Group className="mb-4" id="formGridCheckbox">
                            <a href="#" className='text-decoration-none'>Нет аккаунта? Так создай его!</a>
                        </Form.Group>
                        <div>
                            <Button variant="success" type="submit" className="justify-content-center">
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
