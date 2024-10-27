import './mainpage.css';
import {Col, Container, Row, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {motion, AnimatePresence} from 'framer-motion';
import api from '../../api'; // Импортируйте ваш API
import sportImg from '../../assets/СпортДляМейн.png';
import clockImag from '../../assets/clock.png';
import foodImg from '../../assets/food.svg';
import {Link, useNavigate} from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
            display: true, // Скрыть ось X и её метки
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

const feelings = [
    'Плохо',
    'Так себе',
    'Нормально',
    'Хорошо',
    'Отлично',
]

function MainPage() {
    const navigate = useNavigate();
    const [showStepsForm, setShowStepsForm] = useState(false);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [showSleepForm, setShowSleepForm] = useState(false);
    const [steps, setSteps] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [productName, setProductName] = useState('');
    const [productCalories, setProductCalories] = useState('');
    const [mealType, setMealType] = useState('breakfast'); // По умолчанию завтрак
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sleepDuration, setSleepDuration] = useState('');
    const [sleepQuality, setSleepQuality] = useState(0);
    const [error, setError] = useState('');
    const [stepsChartData, setStepsChartData] = useState({labels: [], datasets: []});
    const [foodChartData, setFoodChartData] = useState({labels: [], datasets: []});
    const [sleepChartData, setSleepChartData] = useState({labels: [], datasets: []});
    const [aiData, setAiData] = useState({activity: '', food: '', sleep: ''});
    const [feeling, setFeeling] = useState(5);

    // Функция для получения данных активности
    const fetchChartsData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const responseActivity = await api.getActivities({
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            const activities = responseActivity.data;

            const responseFood = await api.getMeals({
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            const meals = responseFood.data;

            const responseSleep = await api.getSleepLogs({
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            const sleeps = responseSleep.data;


            // Получаем последние 7 дней и шаги
            const last7Days = [];
            const stepsData = new Array(7).fill(0);
            const foodData = new Array(7).fill(0);
            const sleepData = new Array(7).fill(0);
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
            setStepsChartData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Шаги',
                        data: stepsData,
                        backgroundColor: '#6B9080',
                        borderWidth: 0,
                    },
                ]
            });

            sleeps.forEach(sleep => {
                const sleepDate = sleep.date;
                const index = last7Days.indexOf(sleepDate);
                if (index !== -1) {
                    sleepData[index] = sleep.sleep_duration;
                }
            });
            setSleepChartData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Сон (ч.)',
                        data: sleepData,
                        backgroundColor: '#6B9080',
                        borderWidth: 0,
                    },
                ]
            });

            meals.forEach(meal => {
                const mealDate = meal.date;
                const index = last7Days.indexOf(mealDate);
                if (index !== -1) {
                    foodData[index] = meal.total_calories;
                }
            });
            setFoodChartData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Ккал',
                        data: foodData,
                        backgroundColor: '#6B9080',
                        borderWidth: 0,
                    },
                ]
            });
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
        }
    };

    const handleAddProduct = () => {
        if (productName && productCalories) {
            setSelectedProducts((prev) => [
                ...prev,
                {name: productName, calories: Number(productCalories)},
            ]);
            // Сброс значений полей
            setProductName('');
            setProductCalories('');
        }
    };

    const handleMealSubmit = (e) => {
        e.preventDefault();
        // Обработчик отправки данных
        handleFoodFormSubmit(e);
        // Очистка состояния после отправки
        setSelectedProducts([]);
        setShowFoodForm(false);
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
            setAiData({
                activity: data.activity,
                food: '',
                sleep: data.sleep
            })
        } catch (err) {
            console.error('Ошибка при получении рекомендаций:', err);
        }
    }

    // Используем useEffect для получения данных при загрузке компонента
    useEffect(() => {
        fetchChartsData();
    }, []);
    useEffect(() => {
        fetchAiData();
    }, []);

    const handleStepsFormSubmit = async (e) => {
        e.preventDefault();
        // Логика отправки данных
        try {
            const token = localStorage.getItem('accessToken');
            await api.createActivity({
                steps: parseInt(steps),
                feeling: feeling,
                date
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            setShowStepsForm(false); // Закрыть форму после отправки
            setSteps(''); // Очистить состояние шагов
            setFeeling(5)
            setDate(new Date().toISOString().split('T')[0]); // Обновить дату на сегодня
            await fetchChartsData()
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении шагов');
        }
    };

    const handleSleepFormSubmit = async (e) => {
        e.preventDefault();
        // Логика отправки данных
        try {
            const token = localStorage.getItem('accessToken');
            await api.createSleepLog({
                sleep_duration: parseInt(sleepDuration),
                sleep_quality: sleepQuality,
                date
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            setShowSleepForm(false); // Закрыть форму после отправки
            setSleepDuration('');
            setSleepQuality(0);
            setDate(new Date().toISOString().split('T')[0]); // Обновить дату на сегодня
            await fetchChartsData()
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении сна');
        }
    };

    const handleFoodFormSubmit = async (e) => {
        e.preventDefault();
        // Логика отправки данных
        try {
            const token = localStorage.getItem('accessToken');
            await api.createMeal({
                meal_type: mealType,
                total_calories: selectedProducts.reduce((partialSum, a) => partialSum + a.calories, 0),
                date
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Добавьте токен в заголовок
                }
            });
            setShowFoodForm(false); // Закрыть форму после отправки
            setMealType('breakfast');
            setSelectedProducts([]);
            setDate(new Date().toISOString().split('T')[0]); // Обновить дату на сегодня
            await fetchChartsData()
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении сна');
        }
    };

    const checkProfile = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await api.getUserProfile({
            headers: {
                Authorization: `Bearer ${token}` // Добавьте токен в заголовок
            }
        });
        const data = response.data;
        console.log(data)
        console.log(Object.values(data).every(value => value !== null && value !== '' && value !== 0))
        if (!Object.values(data).every(value => value !== null && value !== '' && value !== 0)) {
            navigate('/profile')
        }
    }
    const isLoggedIn = localStorage.getItem('accessToken') !== null;
    checkProfile()
    if (isLoggedIn) {
        return (
            <>

                <motion.div
                    whileHover={{scale: 1.05}}
                >
                    <Container className="back p-5">
                        <Row className="gap-0">

                            <Col md={4} className="d-flex flex-column justify-content-center">
                                <Link to='/activity' style={{textDecoration: 'none'}}>
                                    <h3 className="mb-5 ">Активность и шаги</h3>
                                    <img src={sportImg} className="w-50" alt="Sport Image"/>
                                </Link>
                            </Col>
                            <Col md={4} className="d-flex flex-column justify-content-center">
                                <h2>Ваша ИИ рекомендация:</h2>
                                <p className="mb-4">
                                    {aiData.activity !== null
                                        ? `Сегодня нужно сделать ${aiData.activity} шагов!`
                                        : 'Введите данные о сне для анализа.'}
                                </p>
                                <div className="p-2">
                                    <Button variant="success" className='custom-button'
                                            onClick={() => setShowStepsForm(true)}>
                                        Ввести данные
                                    </Button>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex flex-column justify-content-center">
                                {stepsChartData.labels.length !== 0 ? (
                                    <>
                                        <Bar data={stepsChartData} options={options}/>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex mt-2 justify-content-center">
                                            <h3>Нет данных</h3>
                                        </div>
                                    </>
                                )
                                }
                            </Col>
                        </Row>
                    </Container>
                </motion.div>

                <AnimatePresence>
                    {showStepsForm && (
                        <>
                            <motion.div
                                className="overlay"
                                initial={{opacity: 0}}
                                animate={{opacity: 0.5}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                                onClick={() => setShowStepsForm(false)}
                            />
                            <motion.div
                                className="modal-form"
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.8}}
                                transition={{duration: 0.3}}
                            >
                                <Form onSubmit={handleStepsFormSubmit} className="p-4 bg-white rounded">
                                    {error &&
                                        <p className="text-danger">{error}</p>} {/* Показываем ошибку, если есть */}
                                    <Form.Group controlId="formSteps">
                                        <Form.Label>Количество шагов</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={steps}
                                            onChange={(e) => setSteps(e.target.value)}
                                            placeholder="Введите количество шагов"
                                            required
                                        />
                                        <Form.Label>Ваше самочувствие</Form.Label>
                                        <Form.Control
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={feeling}
                                            onChange={(e) => setFeeling(Number(e.target.value))}
                                            className="mb-3 mt-3 range"
                                        />
                                        <div className="d-flex justify-content-center">
                                            <p>{feelings[feeling - 1]}</p>
                                        </div>
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


                <motion.div
                    whileHover={{scale: 1.05}}
                >
                    <Container className="back p-5 mb-4">
                        <Row className="gap-0">
                            <Col md={4} className="d-flex flex-column justify-content-center">
                                <Link to='/sleep' style={{textDecoration: 'none'}}>
                                    <h3 className="mb-5 ">Сон</h3>
                                    <img src={clockImag} className="w-50" alt="Sport Image"/>
                                </Link>
                            </Col>
                            <Col md={4} className='d-flex flex-column justify-content-center'>
                                <h2>
                                    Ваша ИИ рекомендация:
                                </h2>
                                <p className="mb-4">
                                    {aiData.sleep !== null
                                        ? `Сегодня нужно поспать ${aiData.sleep} часов!`
                                        : 'Введите данные о сне для анализа.'}
                                </p>
                                <div className="p-2">
                                    <Button variant="success" className='custom-button'
                                            onClick={() => setShowSleepForm(true)}>
                                        Ввести данные
                                    </Button>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex flex-column justify-content-center">
                                <Bar data={sleepChartData} options={options}/>
                            </Col>
                        </Row>
                    </Container>
                </motion.div>

                <AnimatePresence>
                    {showSleepForm && (
                        <>
                            <motion.div
                                className="overlay"
                                initial={{opacity: 0}}
                                animate={{opacity: 0.5}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                                onClick={() => setShowSleepForm(false)}
                            />
                            <motion.div
                                className="modal-form"
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.8}}
                                transition={{duration: 0.3}}
                            >
                                <Form onSubmit={handleSleepFormSubmit} className="p-4 bg-white rounded">
                                    {error &&
                                        <p className="text-danger">{error}</p>} {/* Показываем ошибку, если есть */}
                                    <Form.Group controlId="formSleep">
                                        <Form.Label>Длительность сна</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={sleepDuration}
                                            onChange={(e) => setSleepDuration(e.target.value)}
                                            placeholder="Введите длительность сна (ч.)"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formSleepQuality">
                                        <Form.Label>Качество сна</Form.Label>
                                        <Form.Select
                                            value={sleepQuality}
                                            onChange={(e) => setSleepQuality(e.target.value)}
                                            required
                                        >
                                            <option value="">Выберите качество сна</option>
                                            {/* Пустой вариант для выбора */}
                                            <option value={10}>Отлично</option>
                                            <option value={7}>Хорошо</option>
                                            <option value={4}>Средне</option>
                                            <option value={1}>Плохо</option>
                                        </Form.Select>
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
                <motion.div
                    whileHover={{scale: 1.05}}
                >
                    <Container className="back p-5 mb-4">
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
                                    <Button variant="success" className='custom-button'
                                            onClick={() => setShowFoodForm(true)}>
                                        Ввести данные
                                    </Button>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex flex-column justify-content-center">
                                <Bar data={foodChartData} options={options}/>
                            </Col>
                        </Row>
                    </Container>
                </motion.div>
                <AnimatePresence>
                    {showFoodForm && (
                        <>
                            <motion.div
                                className="overlay"
                                initial={{opacity: 0}}
                                animate={{opacity: 0.5}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                                onClick={() => setShowFoodForm(false)}
                            />
                            <motion.div
                                className="modal-form"
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.8}}
                                transition={{duration: 0.3}}
                            >
                                <Form className="p-4 bg-white rounded">
                                    <h5>Добавление продуктов</h5>
                                    <Form.Group controlId="formProductName">
                                        <Form.Label>Название продукта</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            placeholder="Введите название продукта"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formProductCalories">
                                        <Form.Label>Калорийность</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={productCalories}
                                            onChange={(e) => setProductCalories(e.target.value)}
                                            placeholder="Введите калорийность"
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" className="mt-3 custom-button"
                                            onClick={handleAddProduct}>
                                        Добавить продукт
                                    </Button>
                                </Form>
                                <Form onSubmit={handleMealSubmit} className="p-4 bg-white rounded">
                                    <h5 className="mt-4">Добавление приёма пищи</h5>
                                    <Form.Group controlId="formMealType">
                                        <Form.Group controlId="formDate" className="mt-2">
                                            <Form.Label>Дата</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Label>Тип приёма пищи</Form.Label>
                                        <Form.Select
                                            value={mealType}
                                            onChange={(e) => setMealType(e.target.value)}
                                            required
                                        >
                                            <option value="breakfast">Завтрак</option>
                                            <option value="lunch">Обед</option>
                                            <option value="dinner">Ужин</option>
                                            <option value="snack">Перекус</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <h6>Выбранные продукты:</h6>
                                    <ul>
                                        {selectedProducts.map((product, index) => (
                                            <li key={index}>
                                                {product.name} - {product.calories} ккал
                                            </li>
                                        ))}
                                    </ul>

                                    <Button variant="success" type="submit" className="mt-3 custom-button">
                                        Сохранить приём пищи
                                    </Button>
                                </Form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </>
        )
            ;
    } else {
        return (
            <Container className="d-flex mt-5 justify-content-center">
                <h1>Войдите для просмотра страницы</h1>
            </Container>
        );
    }

}

export default MainPage;
