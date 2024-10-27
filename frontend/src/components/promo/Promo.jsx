import {Container, Row, Col} from 'react-bootstrap';
import DoctorImg from './../../assets/Врач.svg';
import SportImag from './../../assets/Спорт.png'
import FoodImg from '../../assets/Еда.png'
import './promo.css'
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import ClockImg from '../../assets/ClockPromo.svg'

function Promo() {
    return (
        <>
            <Container className="back">
                <Row className="g-0 align-items-center">
                    <Col md={5} className="d-flex flex-column justify-content-center">
                        <div className="p-2">
                            <h1 className="mb-4">Управляйте своим здоровьем с умом</h1>
                            <p className="mb-4">
                                Наше приложение для управления здоровьем и активностью — это ваш персональный помощник,
                                который поможет оставаться в форме, поддерживать оптимальный режим сна и питания, а
                                также
                                следить за важными показателями здоровья!
                            </p>
                        </div>
                        <div className='d-flex justify-content-center mb-4'>
                            <Button as={Link} to='/registration' variant="success" className="custom-button promo">Присоединиться</Button>
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
            <Container className="back bg-body">
                <h2 className="fw-bold">Что умеет приложение?</h2>
            </Container>
            <Container className="back mb-4">
                <Row className="g-0 align-items-center">
                    <Col md={7} className="d-flex justify-content-center">
                        <img
                            src={SportImag} // Замените URL на свой
                            alt="Пример"
                            className="img-fluid" // Класс для адаптивного изображения
                        />
                    </Col>
                    <Col md={5} className="d-flex flex-column justify-content-center">
                        <div className="p-2">
                            <h2 className="mb-4 fw-bold">Мониторинг активности</h2>
                            <p className="mb-4 ">
                                Отслеживайте шаги, пройденное расстояние, сожжённые калории и другие показатели, чтобы
                                оставаться в движении и достигать целей!
                            </p>
                        </div>

                    </Col>

                </Row>
            </Container>
            <Container className="back mb-4">
                <Row className="g-0 align-items-center">

                    <Col md={5} className="d-flex flex-column justify-content-center">

                        <div className="p-2">
                            <h2 className="mb-4 fw-bold">Анализ сна</h2>
                            <p className="mb-4 ">
                                Получайте ценные рекомендации по улучшению качества сна на основе ежедневного анализа.
                            </p>
                        </div>

                    </Col>
                    <Col md={7} className="d-flex justify-content-center">
                        <img
                            src={ClockImg} // Замените URL на свой
                            alt="Пример"
                            className="img-fluid w-75" // Класс для адаптивного изображения
                        />
                    </Col>

                </Row>
            </Container>
            <Container className="back mb-4">
                <Row className="g-0 align-items-center">
                    <Col md={7} className="d-flex justify-content-center">
                        <img
                            src={FoodImg} // Замените URL на свой
                            alt="Пример"
                            className="img-fluid" // Класс для адаптивного изображения
                        />
                    </Col>
                    <Col md={5} className="d-flex flex-column justify-content-center">
                        <div className="p-2">
                            <h2 className="mb-4 fw-bold">Питание и калории</h2>
                            <p className="mb-4">
                                Не забывайте пить воду и следить за питанием с нашими напоминаниями и удобным дневником.
                            </p>
                        </div>

                    </Col>

                </Row>
            </Container>
        </>
    );
}

export default Promo;
