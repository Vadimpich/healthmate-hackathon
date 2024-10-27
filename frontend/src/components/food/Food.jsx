import './food.css'; // Измените имя файла на calories.css
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

function Calories() {
    const [showCaloriesForm, setShowCaloriesForm] = useState(false);
    const [mealType, setMealType] = useState('');
    const [calories, setCalories] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [meals, setMeals] = useState([]);
    const [error, setError] = useState('');
    const [editingMealLogId, setEditingMealLogId] = useState(null);
    const [foodChartData, setFoodChartData] = useState({labels: [], datasets: []});
    const foodChoises = {
        breakfast: 'Завтрак',
        lunch: 'Обед',
        dinner: 'Ужин',
        snack: 'Перекус',
    };
    const fetchChartsData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const responseMeals = await api.getMeals({
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const meals = responseMeals.data;
            setMeals(meals);

            const last7Days = [];
            const foodData = new Array(7).fill(0);
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                last7Days.push(date.toISOString().split('T')[0]);
            }

            meals.forEach(meal => {
                const mealDate = meal.date;
                const index = last7Days.indexOf(mealDate);
                if (index !== -1) {
                    foodData[index] += meal.calories; // Изменено на правильное поле
                }
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


    useEffect(() => {
        fetchChartsData();
    }, []);

    const handleEditClick = (log) => {
        setMealType(log.meal_type); // Изменено на правильное поле
        setCalories(log.calories); // Изменено на правильное поле
        setDate(log.date);
        setEditingMealLogId(log.id);
        setShowCaloriesForm(true);
    };

    return (
        <Container>
            <Card className='mt-3 mb-3'>
                <Card.Body className='d-flex flex-column justify-content-center p-4'>
                    <Card.Title><h2>Калории</h2></Card.Title>
                    <Row className='align-items-end mb-3'>
                        <div className='w-50'>
                            <Bar data={foodChartData} options={options}/>
                        </div>
                        <div className='w-50'>
                            <Line options={optionsLine} data={foodChartData}/>
                        </div>
                    </Row>

                    <Card.Text className='mt-3'>
                        <Table striped="columns" className='custom-table'>
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Тип приема пищи</th>
                                <th>Калорийность</th>
                            </tr>
                            </thead>
                            <tbody>
                            {meals.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.date}</td>
                                    <td>{foodChoises[log.meal_type]}</td>
                                    <td className={'d-flex justify-content-between'}>
                                        {log.total_calories}
                                        <Button variant={'link'} onClick={() => handleEditClick(log)}>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>

        </Container>
    );
}

export default Calories;
