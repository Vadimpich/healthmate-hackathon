import { Container, Row, Col } from 'react-bootstrap';
import DoctorImg from './../../assets/Врач.svg';
import SportImag from './../../assets/Спорт.png';
import FoodImg from '../../assets/Еда.png';
import './promo.css';
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ClockImg from '../../assets/ClockPromo.svg';
import { motion } from 'framer-motion';


function Promo() {
    return (
        <motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.6, once: true }}
                custom={0}
                variants={boxAnimation}
            >
                <Container className="back">
                    <Row className="g-0 align-items-center">
                        <Col md={5} className="d-flex flex-column justify-content-center">
                            <div className="p-2">
                                <motion.h1
                                    custom={1}
                                    variants={logoAnimation}
                                    className="mb-4"
                                >
                                    Управляйте своим здоровьем с умом
                                </motion.h1>
                                <motion.p
                                    custom={2}
                                    variants={logoAnimation}
                                    className="mb-4"
                                >
                                    Наше приложение — это ваш персональный помощник,
                                    который поможет оставаться в форме, а также следить за важными показателями здоровья!
                                </motion.p>
                            </div>
                            <motion.div
                                custom={3}
                                variants={logoAnimation}
                                className='d-flex justify-content-center mb-4'
                            >
                                <motion.div whileHover={{ scale: 1.2 }}>
                                    <Button as={Link} to='/registration' variant="success"
                                            className="custom-button promo">Присоединиться</Button>
                                </motion.div>
                            </motion.div>
                        </Col>
                        <Col md={7} className="d-flex justify-content-center">
                            <motion.img
                                custom={2}
                                variants={logoAnimation}
                                src={DoctorImg}
                                alt="Пример"
                                className="img-fluid"
                            />
                        </Col>
                    </Row>
                </Container>
            </motion.div>

            {/* Second Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.6, once: true }}
            >
                <Container className="back bg-body">
                    <motion.h2
                        custom={3}
                        variants={logoAnimation}
                        className="fw-bold"
                    >
                        Что умеет приложение?
                    </motion.h2>
                </Container>

                <motion.div custom={-1} variants={boxAnimation}>
                    <Container className="back mb-4">
                        <Row className="g-0 align-items-center">
                            <Col md={7} className="d-flex justify-content-center">
                                <motion.img
                                    custom={2}
                                    variants={logoAnimation}
                                    src={SportImag}
                                    alt="Пример"
                                    className="img-fluid"
                                />
                            </Col>
                            <Col md={5} className="d-flex flex-column justify-content-center">
                                <div className="p-2">
                                    <motion.h2 custom={1} variants={logoAnimation} className="mb-4 fw-bold">
                                        Мониторинг активности
                                    </motion.h2>
                                    <motion.p custom={2} variants={logoAnimation} className="mb-4">
                                        Отслеживайте шаги, пройденное расстояние, сожжённые калории и другие показатели, чтобы
                                        оставаться в движении и достигать целей!
                                    </motion.p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </motion.div>
            </motion.div>

            {/* Third Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.6, once: true }}
                custom={1}
                variants={boxAnimation}
            >
                <Container className="back mb-4">
                    <Row className="g-0 align-items-center">
                        <Col md={5} className="d-flex flex-column justify-content-center">
                            <div className="p-2">
                                <motion.h2 custom={1} variants={logoAnimation} className="mb-4 fw-bold">
                                    Анализ сна
                                </motion.h2>
                                <motion.p custom={2} variants={logoAnimation} className="mb-4">
                                    Получайте ценные рекомендации по улучшению качества сна на основе ежедневного анализа.
                                </motion.p>
                            </div>
                        </Col>
                        <Col md={7} className="d-flex justify-content-center">
                            <motion.img
                                custom={2}
                                variants={logoAnimation}
                                src={ClockImg}
                                alt="Пример"
                                className="img-fluid w-75"
                            />
                        </Col>
                    </Row>
                </Container>
            </motion.div>

            {/* Fourth Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.6, once: true }}
                custom={-1}
                variants={boxAnimation}
            >
                <Container className="back mb-4">
                    <Row className="g-0 align-items-center">
                        <Col md={7} className="d-flex justify-content-center">
                            <motion.img
                                custom={2}
                                variants={logoAnimation}
                                src={FoodImg}
                                alt="Пример"
                                className="img-fluid"
                            />
                        </Col>
                        <Col md={5} className="d-flex flex-column justify-content-center">
                            <div className="p-2">
                                <motion.h2 custom={1} variants={logoAnimation} className="mb-4 fw-bold">
                                    Питание и калории
                                </motion.h2>
                                <motion.p custom={2} variants={logoAnimation} className="mb-4">
                                    Не забывайте пить воду и следить за питанием с нашими напоминаниями и удобным дневником.
                                </motion.p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </motion.div>
        </motion.div>
    );
}

export default Promo;

export const boxAnimation = {
    hidden: (custom) => ({
        opacity: 0,
        x: custom < 0 ? -50 : 50,
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeInOut"
        }
    }
};

export const logoAnimation = {
    hidden:  {
        opacity: 0,

    },
    visible: (custom) => ({
        opacity: 1,

        transition: {
            duration: 0.8,
            delay: custom * 0.2,
            ease: "easeInOut"
        }
    })
};
