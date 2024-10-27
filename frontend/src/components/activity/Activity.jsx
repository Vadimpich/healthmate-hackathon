import './activity.css';
import EditImg from './../../assets/edit.svg';
import { Card, Container, Form, Row, Table } from "react-bootstrap";
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
import { Bar, Line } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import api from "../../api/index.js";
import { AnimatePresence, motion } from "framer-motion";
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

function Activity() {
    const [showForm, setShowForm] = useState(false);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [lineData, setLineData] = useState({ labels: [], datasets: [] });
    const [activity, setActivity] = useState([]);
    const [steps, setSteps] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [editingActivityId, setEditingActivityId] = useState(null); // ID редактируемой активности

    const fetchActivityData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await api.getActivities({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const activities = response.data;
            setActivity(activities);

            const last7Days = [];
            const stepsData = new Array(7).fill(0);
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                last7Days.push(date.toISOString().split('T')[0]);
            }

            activities.forEach(act => {
                const index = last7Days.indexOf(act.date);
                if (index !== -1) {
                    stepsData[index] = act.steps;
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

            setLineData({
                labels: last7Days,
                datasets: [
                    {
                        label: 'Шаги',
                        data: stepsData,
                        fill: false,
                        backgroundColor: '#6B9080',
                        borderColor: '#6B9080',
                        tension: 0.3
                    },
                ],
            });
        } catch (err) {
            console.error('Ошибка при получении активности:', err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            if (editingActivityId) {
                // Если мы редактируем существующую активность
                await api.updateActivity(editingActivityId, {
                    steps: parseInt(steps),
                    date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                // Если мы создаем новую активность
                await api.createActivity({
                    steps: parseInt(steps),
                    date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setShowForm(false);
            setSteps('');
            setDate(new Date().toISOString().split('T')[0]);
            setEditingActivityId(null); // Сброс ID редактируемой активности
            fetchActivityData(); // Обновляем данные после изменения
        } catch (err) {
            setError(err.response?.data?.detail || 'Произошла ошибка при сохранении шагов');
        }
    };

    useEffect(() => {
        fetchActivityData();
    }, []);

    const handleEditClick = (activity) => {
        setSteps(activity.steps); // Устанавливаем шаги для редактирования
        setDate(activity.date); // Устанавливаем дату для редактирования
        setEditingActivityId(activity.id); // Устанавливаем ID активности для редактирования
        setShowForm(true); // Открываем форму
    };

    return (
        <Container>
            <Card className='mt-3 mb-3'>
                <Card.Body className='d-flex flex-column justify-content-center p-4'>
                    <Card.Title><h2>Активность и шаги</h2></Card.Title>
                    <Row className='align-items-end mb-3'>
                        <div className='w-50'>
                            <Bar data={chartData} options={options} />
                        </div>

                        <div className='w-50'>
                            <Line options={optionsLine} data={lineData} />
                        </div>
                    </Row>

                    <Card.Text className='mt-3'>
                        <Table striped="columns" className='custom-table'>
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Количество шагов</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activity.map((act) => (
                                <tr key={act.id}>
                                    <td>{act.date}</td>
                                    <td className={'d-flex justify-content-between'}>
                                        {act.steps}
                                        <Button variant={'link'} onClick={() => handleEditClick(act)}>
                                            <img src={EditImg} alt={"Edit"} />
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
                                {error && <p className="text-danger">{error}</p>}
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
                                        required
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit" className="mt-3 custom-button">
                                    {editingActivityId ? 'Обновить данные' : 'Сохранить данные'}
                                </Button>
                            </Form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Container>
    );
}

export default Activity;
