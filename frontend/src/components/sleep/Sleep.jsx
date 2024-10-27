import './sleep.css';
import EditImg from './../../assets/edit.svg';
import {Card, Container, Form, Row, Table} from "react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import {Bar, Line} from 'react-chartjs-2';
import {useEffect, useState} from "react";
import api from "../../api/index.js";
import {AnimatePresence, motion} from "framer-motion";
import Button from "react-bootstrap/Button";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const optionsLine = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        x: {
            title: {
                display: false,
            },
        },
        y: {
            title: {
                display: false,
            },
            beginAtZero: true,
        },
    },
};

const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
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
            display: true,
            grid: {
                display: true,
            },
        },
        y: {
            display: true,
            grid: {
                display: true,
            },
        },
    },
};

function Sleep() {
    const [showSleepForm, setShowSleepForm] = useState(false);
    const [sleepDuration, setSleepDuration] = useState('');
    const [sleepQuality, setSleepQuality] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [sleeps, setSleeps] = useState([]);
    const [error, setError] = useState('');
    const [editingSleepLogId, setEditingSleepLogId] = useState(null);
    const [sleepChartData, setSleepChartData] = useState({labels: [], datasets: []});
    const [lineData, setLineData] = useState({labels: [], datasets: []});
    const sleepQualityLabels = {
        10: "Отлично",
        7: "Хорошо",
        4: "Средне",
        1: "Плохо",
    };
    const fetchChartsData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const responseSleep = await api.getSleepLogs({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sleeps = responseSleep.data;
            setSleeps(sleeps);

            const last7Days = [];
            const sleepData = new Array(7).fill(0);
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                last7Days.push(date.toISOString().split('T')[0]);
            }

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

            setLineData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Сон (ч.)',
                        data: sleepData,
                        fill: false,
                        backgroundColor: '#6B9080',
                        borderColor: '#6B9080',
                        tension: 0.3
                    },
                ],
            });
        } catch (err) {
            console.error('Ошибка при получении данных:', err);
        }
    };

    const handleSleepFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const sleepData = {
            sleep_duration: parseInt(sleepDuration),
            sleep_quality: sleepQuality,
            date,
        };

        try {
            if (editingSleepLogId) {
                // Обновление существующей записи о сне
                await api.updateSleepLog(editingSleepLogId, sleepData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Логика добавления новой записи о сне (если необходимо)
                await api.createSleepLog(sleepData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            resetForm();
            await fetchChartsData();
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении сна');
        }
    };

    const resetForm = () => {
        setShowSleepForm(false);
        setSleepDuration('');
        setSleepQuality('');
        setDate(new Date().toISOString().split('T')[0]);
        setEditingSleepLogId(null);
        setError('');
    };

    useEffect(() => {
        fetchChartsData();
    }, []);

    const handleEditClick = (log) => {
        setSleepDuration(log.sleep_duration); // Изменено на правильное поле
        setSleepQuality(log.sleep_quality); // Изменено на правильное поле
        setDate(log.date);
        setEditingSleepLogId(log.id);
        setShowSleepForm(true);
    };

    return (
        <Container>
            <Card className='mt-3 mb-3'>
                <Card.Body className='d-flex flex-column justify-content-center p-4'>
                    <Card.Title><h2>Сон</h2></Card.Title>
                    <Row className='align-items-end mb-3'>
                        <div className='w-50'>
                            <Bar data={sleepChartData} options={options}/>
                        </div>
                        <div className='w-50'>
                            <Line options={optionsLine} data={lineData}/>
                        </div>
                    </Row>

                    <Card.Text className='mt-3'>
                        <Table striped="columns" className='custom-table'>
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Длительность сна</th>
                                <th>Качество сна</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sleeps.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.date}</td>
                                    <td>{log.sleep_duration}</td>
                                    <td className={'d-flex justify-content-between'}>
                                        {sleepQualityLabels[log.sleep_quality] || "Не указано"}
                                        <Button variant={'link'} onClick={() => handleEditClick(log)}>
                                            <img src={EditImg} alt={"Edit"}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>
            <AnimatePresence>
                {showSleepForm && (
                    <>
                        <motion.div
                            className="overlay"
                            initial={{opacity: 0}}
                            animate={{opacity: 0.5}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                            onClick={resetForm}
                        />
                        <motion.div
                            className="modal-form"
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.3}}
                        >
                            <Form onSubmit={handleSleepFormSubmit} className="p-4 bg-white rounded">
                                {error && <p className="text-danger">{error}</p>}
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
                                    {editingSleepLogId ? 'Обновить данные' : 'Сохранить данные'}
                                </Button>
                            </Form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Container>
    );
}

export default Sleep;
