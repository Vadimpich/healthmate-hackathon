import axios from 'axios';

// Создайте экземпляр axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/', // Укажите базовый URL вашего API
});

// Добавьте интерсептор для обработки истекшего токена
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // Если ответ успешный, просто возвращаем его
    },
    async (error) => {
        const originalRequest = error.config;

        // Проверяем, истек ли токен
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Помечаем, что попытка обновления была сделана
            const refreshToken = localStorage.getItem('refreshToken'); // Предположим, вы храните его в localStorage

            // Попробуйте обновить токен
            try {
                const newTokens = await api.refreshToken(refreshToken);

                // Сохраняем новый токен
                localStorage.setItem('accessToken', newTokens.access);
                // Обновляем заголовок Authorization
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newTokens.access}`;

                // Повторяем оригинальный запрос
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Если не удалось обновить токен, вы можете выполнить выход из системы или другое действие
                console.error("Не удалось обновить токен:", refreshError);
                // Выполните выход или покажите уведомление пользователю
            }
        }

        return Promise.reject(error); // Если произошла другая ошибка, возвращаем её
    }
);

// Настройка заголовков по умолчанию
const token = localStorage.getItem('accessToken');
if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const api = {
    // Функция для регистрации пользователя
    async registerUser(userData) {
        console.log(userData);
        const response = await axiosInstance.post('/register/', userData);
        return response.data;
    },

    // Функция для входа пользователя
    async loginUser(credentials) {
        const response = await axiosInstance.post('/login/', credentials);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        // Обновляем заголовок Authorization
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        return response.data;
    },

    // Функция для выхода пользователя
    async logoutUser(data) {
        const response = await axiosInstance.post('/logout/', data);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Удаляем заголовок Authorization
        delete axiosInstance.defaults.headers.common['Authorization'];
        return response.data;
    },

    // Функция для обновления токена
    async refreshToken(refreshToken) {
        const response = await axiosInstance.post('/login/refresh/', {
            refresh: refreshToken,
        });
        return response.data; // Вернёт новый access token
    },

    // Функции для работы с профилем, продуктами, приемами пищи, активностью и т. д.
    async getUserProfile() {
        const response = await axiosInstance.get('/profile/');
        return response.data;
    },

    // Функция для обновления профиля пользователя
    async updateUserProfile(profileData) {
        const response = await axiosInstance.put('/profile/', profileData);
        return response.data;
    },

    // Функция для получения списка продуктов
    async getProducts() {
        const response = await axiosInstance.get('/products/');
        return response.data;
    },

    // Функция для создания нового продукта
    async createProduct(productData) {
        const response = await axiosInstance.post('/products/create/', productData);
        return response.data;
    },

    // Функция для обновления продукта
    async updateProduct(id, productData) {
        const response = await axiosInstance.put(`/products/${id}/edit/`, productData);
        return response.data;
    },

    // Функция для получения списка приемов пищи
    async getMeals() {
        const response = await axiosInstance.get('/meals/');
        return response.data;
    },



    // Функция для создания нового приема пищи
    async createMeal(mealData) {
        const response = await axiosInstance.post('/meals/create/', mealData);
        return response.data;
    },

    // Функция для обновления приема пищи
    async updateMeal(id, mealData) {
        const response = await axiosInstance.put(`/meals/${id}/edit/`, mealData);
        return response.data;
    },

    // Функция для получения списка активности
    async getActivities() {
        const response = await axiosInstance.get('/activity/');
        return response;
    },

    // Функция для создания новой активности
    async createActivity(activityData) {
        const response = await axiosInstance.post('/activity/create/', activityData);
        return response.data;
    },

    // Функция для обновления активности
    async updateActivity(id, activityData) {
        const response = await axiosInstance.put(`/activity/${id}/edit`, activityData);
        return response.data;
    },

    // Функция для получения статистики
    async getAnalytics() {
        return await axiosInstance.get('/analytics/');
    },

    // Функция для получения списка сна
    async getSleepLogs() {
        const response = await axiosInstance.get('/sleep/');
        return response.data;
    },

    // Функция для создания записи о сне
    async createSleepLog(sleepData) {
        const response = await axiosInstance.post('/sleep/create/', sleepData);
        return response.data;
    },

    // Функция для обновления записи о сне
    async updateSleepLog(id, sleepData) {
        const response = await axiosInstance.put(`/sleep/${id}/edit/`, sleepData);
        return response.data;
    },
};

export default api;