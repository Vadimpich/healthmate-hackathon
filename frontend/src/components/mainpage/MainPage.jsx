import './mainpage.css'
import {Col, Container, Row, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {motion, AnimatePresence} from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import sportImg from '../../assets/СпортДляМейн.png'
import clockImag from '../../assets/clock.png'
import foodImg from '../../assets/food.svg'

const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
        {
            label: 'Sales',
            data: [33, 53, 85, 41, 44],
            backgroundColor: '#6B9080',
            borderWidth: 0,
        },
    ],
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            display: false, // Скрыть ось X и её метки
            grid: {
                display: false, // Скрыть сетку по оси X
            },
        },
        y: {
            display: false, // Скрыть ось Y и её метки
            grid: {
                display: false, // Скрыть сетку по оси Y
            },
        },
    },
};

const items = [
    {
        id: 1,
        title: 'Активность и шаги',
        img: sportImg,
        recommendation: 'Сегодня нужно сделать 5600 шагов!',
    },
    {
        id: 2,
        title: 'Питание',
        img: foodImg,
        recommendation: 'Сегодня нужно съесть 2200 Ккал! Не забудьте про обед!',
    },
    {
        id: 3,
        title: 'Сон',
        img: clockImag,
        recommendation: 'Сегодня нужно спать 8 часов! Ложитесь пораньше',
    },
];

function MainPage() {
    const [showForm, setShowForm] = useState(false);
    const [steps, setSteps] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Логика отправки данных
        console.log("Шаги:", steps, "Дата:", date);
        setShowForm(false); // Закрыть форму после отправки
    };
    return (
        <>
            <Container className="back p-5">
                <Row className="gap-0">
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <h3 className="mb-5 ">Активность и шаги</h3>
                        <img src={sportImg} className="w-50" alt="Sport Image"/>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <h2>Ваша ИИ рекомендация:</h2>
                        <p className="mb-4">Сегодня нужно сделать 5600 шагов!</p>
                        <div className="p-2">
                            <Button variant="success" onClick={() => setShowForm(true)}>
                                Ввести данные
                            </Button>
                        </div>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <Bar data={data} options={options}/>
                        <div className="d-flex mt-2 justify-content-center">
                            <Button variant="success">Статистика</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            className="overlay"
                            initial={{opacity: 0}}
                            animate={{opacity: 0.5}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                            onClick={() => setShowForm(false)}
                        />
                        <motion.div
                            className="modal-form"
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.3}}
                        >
                            <Form onSubmit={handleFormSubmit} className="p-4 bg-white rounded">
                                <Form.Group controlId="formSteps">
                                    <Form.Label>Количество шагов</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={steps}
                                        onChange={(e) => setSteps(e.target.value)}
                                        placeholder="Введите количество шагов"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDate" className="mt-2">
                                    <Form.Label>Дата</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit" className="mt-3">
                                    Сохранить данные
                                </Button>
                            </Form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Container className="back p-5">
                <Row className="gap-0">
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <h3 className="mb-5 ">Питание</h3>
                        <img src={foodImg} className="w-50" alt="Sport Image"/>
                    </Col>
                    <Col md={4} className='d-flex flex-column justify-content-center'>
                        <h2>
                            Ваша ИИ рекомендация:
                        </h2>
                        <p className="mb-4">
                            Сегодня нужно съесть 2200 Ккал! Не забудьте про обед!
                        </p>
                        <div className="p-2">
                            <Button variant="success">Ввести данные </Button>
                        </div>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <Bar data={data} options={options}/>
                        <div className='d-flex mt-2 justify-content-center'>
                            <Button variant="success">Статистика</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container className="back p-5 mb-4">
                <Row className="gap-0">
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <h3 className="mb-5 ">Сон</h3>
                        <img src={clockImag} className="w-50" alt="Sport Image"/>
                    </Col>
                    <Col md={4} className='d-flex flex-column justify-content-center'>
                        <h2>
                            Ваша ИИ рекомендация:
                        </h2>
                        <p className="mb-4">
                            Сегодня нужно спать 8 часов! Ложитесь пораньше
                        </p>
                        <div className="p-2">
                            <Button variant="success">Ввести данные </Button>
                        </div>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <Bar data={data} options={options}/>
                        <div className='d-flex mt-2 justify-content-center'>
                            <Button variant="success">Статистика</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


export default MainPage