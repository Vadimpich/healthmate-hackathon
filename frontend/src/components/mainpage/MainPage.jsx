import './mainpage.css';
import { Col, Container, Row, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api'; // Импортируйте ваш API
import sportImg from '../../assets/СпортДляМейн.png';
import clockImag from '../../assets/clock.png';
import foodImg from '../../assets/food.svg';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', '123', '123'],
    datasets: [
        {
            label: 'Статистика',
            data: [33, 53, 85, 41, 44, 45, 40],
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

function MainPage() {
    const [showForm, setShowForm] = useState(false);
    const [steps, setSteps] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [aiData, setAiData] = useState({activity: '', food: '', sleep: ''});

    // Функция для получения данных активности
    const fetchActivityData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.getActivities({
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            const activities = response.data;
            console.log(activities)

            // Получаем последние 7 дней и шаги
            const last7Days = [];
            const stepsData = new Array(7).fill(0); // Инициализируем массив шагов нулями
            const today = new Date();

            // Заполняем массив последних 7 дней
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                last7Days.push(date.toISOString().split('T')[0]); // Формат YYYY-MM-DD
            }

            // Сопоставляем шаги с датами
            activities.forEach(activity => {
                const activityDate = activity.date; // Убедитесь, что здесь правильное поле даты
                const index = last7Days.indexOf(activityDate);
                if (index !== -1) {
                    stepsData[index] = activity.steps; // Заполняем шагами
                }
            });

            setChartData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Шаги',
                        data: stepsData,
                        backgroundColor: '#6B9080',
                        borderWidth: 0,
                    },
                ],
            });
        } catch (err) {
            console.error('Ошибка при получении активности:', err);
        }
    };
    const fetchAiData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.getAnalytics({
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            const data = response.data;
            console.log(data)
            setAiData({
                activity: data.activity
            })
        } catch (err) {
            console.error('Ошибка при получении рекомендаций:', err);
        }
    }

    // Используем useEffect для получения данных при загрузке компонента
    useEffect(() => {
        fetchActivityData();
    }, []); // Зависимости пустые, чтобы вызвать один раз при монтировании компонента
    useEffect(() => {
        fetchAiData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Логика отправки данных
        try {
            const token = localStorage.getItem('accessToken');
            console.log(token)
            await api.createActivity({
                steps: parseInt(steps),
                date
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            console.log("Шаги:", steps, "Дата:", date);
            setShowForm(false); // Закрыть форму после отправки
            setSteps(''); // Очистить состояние шагов
            setDate(new Date().toISOString().split('T')[0]); // Обновить дату на сегодня
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении шагов');
        }
    };
    const isLoggedIn = localStorage.getItem('accessToken') !== null;
    if (isLoggedIn) {
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
                            <p className="mb-4">Сегодня нужно сделать {aiData.activity} шагов!</p>
                            <div className="p-2">
                                <Button variant="success" className='custom-button' onClick={() => setShowForm(true)}>
                                    Ввести данные
                                </Button>
                            </div>
                        </Col>
                        <Col md={4} className="d-flex flex-column justify-content-center">
                            <Bar data={chartData} options={options}/>
                            <div className="d-flex mt-2 justify-content-center">
                                <Button variant="success" className='custom-button'>Статистика</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <AnimatePresence>
                    {showForm && (
                        <>
                            <motion.div
                                className="overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setShowForm(false)}
                            />
                            <motion.div
                                className="modal-form"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Form onSubmit={handleFormSubmit} className="p-4 bg-white rounded">
                                    {error && <p className="text-danger">{error}</p>} {/* Показываем ошибку, если есть */}
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
                                    <Button variant="success" type="submit" className="mt-3 custom-button">
                                        Сохранить данные
                                    </Button>
                                </Form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Остальные контейнеры для питания и сна остаются без изменений */}
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
                                <Button variant="success" className='custom-button'>Ввести данные </Button>
                            </div>
                        </Col>
                        <Col md={4} className="d-flex flex-column justify-content-center">
                            <Bar data={data} options={options}/>
                            <div className='d-flex mt-2 justify-content-center'>
                                <Button variant="success" className='custom-button'>Статистика</Button>
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
                                <Button variant="success" className='custom-button'>Ввести данные </Button>
                            </div>
                        </Col>
                        <Col md={4} className="d-flex flex-column justify-content-center">
                            <Bar data={data} options={options}/>
                            <div className='d-flex mt-2 justify-content-center'>
                                <Button variant="success" className='custom-button'>Статистика</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    } else {
        return(
          <Container className="d-flex mt-5 justify-content-center">
              <h1>Войдите для просмотра страницы</h1>
          </Container>
        );
    }

}

export default MainPage;
