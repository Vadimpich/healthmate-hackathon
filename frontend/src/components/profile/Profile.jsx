import './profile.css'
import {Col, Container, Form, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import SportImg from "../../assets/СпортДляМейн.png";

function Profile() {
    return (
        <Container className="back">
            <Row className="p-2 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <Form>

                            <Form.Group as={Col} className='mb-3' controlId="formGridName">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control  placeholder="Введите ваше имя" />
                            </Form.Group>

                            <Form.Group  as={Col} className='mb-3' controlId="formGridLastName">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control  placeholder="Введите фамилию" />
                            </Form.Group>



                        <Row className="mb-3">
                            <Form.Group as={Col} className='mb-3' controlId="formGridAge">
                                <Form.Label>Возраст</Form.Label>
                                <Form.Control  placeholder="Введите ваш возраст" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Пол</Form.Label>
                                <Form.Select defaultValue="Мужской">
                                    <option>Мужской</option>
                                    <option>Женский</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} className='mb-3' controlId="formGridHeight">
                                <Form.Label>Рост</Form.Label>
                                <Form.Control  placeholder="Введите ваш рост" />
                            </Form.Group>

                            <Form.Group  as={Col} className='mb-3' controlId="formGridWeight">
                                <Form.Label>Вес</Form.Label>
                                <Form.Control  placeholder="Введите ваш вес" />
                            </Form.Group>
                        </Row>

                        <Button variant="success" type="submit">
                            Сохранить
                        </Button>
                    </Form>
                </Col>
                <Col md={7} className="d-flex justify-content-center">
                    <img
                        src={SportImg}
                        alt="Пример"
                        className="img-fluid w-50"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Profile