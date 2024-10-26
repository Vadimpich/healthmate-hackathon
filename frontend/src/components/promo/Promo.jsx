
import { Container, Row, Col } from 'react-bootstrap';
import DoctorImg from './../../assets/Врач.svg'; // Замените на ваш путь к изображению
import './promo.css'
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

function Promo() {
    return (
        <Container className="back">
            <Row className="g-0 align-items-center">
                <Col md={5} className="d-flex flex-column justify-content-center">
                    <div className="p-2">
                        <h1 className="mb-4">Управляйте своим здоровьем с умом</h1>
                        <p className="mb-4">
                            Наше приложение для управления здоровьем и активностью — это ваш персональный помощник,
                            который поможет оставаться в форме, поддерживать оптимальный режим сна и питания, а также
                            следить за важными показателями здоровья!
                        </p>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <Button as={Link} to='/registration' variant="success">Регистрация</Button>
                    </div>
                </Col>
                <Col md={7} className="d-flex justify-content-center">
                    <img
                        src={DoctorImg} // Замените URL на свой
                        alt="Пример"
                        className="img-fluid" // Класс для адаптивного изображения
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Promo;
