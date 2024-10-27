import os

import numpy as np
import psycopg2
from dotenv import load_dotenv

load_dotenv()


def insert_correction_data(rate, steps):
    conn = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'))
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO user_rate (rate, steps)
        VALUES (%s, %s)
    """, (rate, steps.astype(int).item(0)))
    conn.commit()
    cur.close()
    conn.close()


def adjust_weights_with_feedback(predicted_steps, actual_steps, user_feedback):
    if actual_steps < predicted_steps:
        insert_correction_data(user_feedback, predicted_steps)
    else:
        insert_correction_data(user_feedback, actual_steps - predicted_steps)


def grad_plus_steps(X, y):
    learning_rate = 0.01
    iterations = 1000
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0
    for i in range(iterations):
        y_pred = X.dot(weights) + bias
        error = y_pred - y
        dw = (1 / m) * np.dot(X.T, error)
        db = (1 / m) * np.sum(error)
        weights -= learning_rate * dw
        bias -= learning_rate * db

    return weights


class LinearRegression:
    def init(self):
        self.weights = None
        self.bias = None

    def fit(self, X, y):
        X = np.c_[np.ones(X.shape[0]), X]
        X_T_X_inv = np.linalg.pinv(X.T @ X)
        self.weights = X_T_X_inv @ X.T @ y

    def predict(self, X):
        X = np.c_[np.ones(X.shape[0]), X]
        return X @ self.weights
        return X @ self.weights


def normalize_to_range(array):
    min_value = np.min(array)
    max_value = np.max(array)
    normalized_array = (array - min_value) / (max_value - min_value)
    return normalized_array


def drop_column(rows):
    return [row[:3] + row[4:6] + row[8:9] + row[11:12] for row in rows]


def replace_gender(rows):
    return [
        (1 if row[1] == 'Male' else 2, *row[2:])
        if row[1] in ['Male', 'Female']
        else row
        for row in rows
    ]


def replace_none_with_zero(rows):
    return [
        tuple(0 if value is None else value for value in row)
        for row in rows
    ]


def replace_weight(rows):
    return [
        tuple(tuple(
            1 if value == 'Normal' or value == 'Normal Weight' else 2 if value == 'Overweight' else 3 if value == 'Obese' else value
            for value in row
        ))
        for row in rows
    ]


def train_set(rows):
    return [row[:-1] for row in rows]


def work_set(rows):
    return [row[-1] for row in rows]


def bmi_category(bmi):
    if (bmi <= 18):
        return 1
    elif (19 < bmi <= 40):
        return 2
    else:
        return 3


def grad_process(user_rate):
    conn = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM user_rate;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    x_set = np.array(train_set(rows))
    y_set = np.array(work_set(rows))
    X = x_set.reshape(-1, 1)
    y = y_set
    weights = grad_plus_steps(X, y)
    return user_rate * weights[0]


def analyze_activity(gender, age, weight, height, sleep_duration,
                     quality_of_sleep, actual_steps, rate):
    bmi = bmi_category(weight / (height))
    x = np.array([[int(gender), int(age), float(sleep_duration),
                   int(quality_of_sleep), bmi]])
    rows = processing()
    daily_steps = predicts(rows, x) + grad_process(10)
    if (rate < 5):
        adjust_weights_with_feedback(daily_steps, actual_steps, rate)
    return daily_steps.astype(int).item()


def update_set_pr():
    processing()


def predicts(rows, x):
    x_set = np.array(train_set(rows))
    y_set = np.array(work_set(rows))
    model = LinearRegression()
    model.fit(x_set, y_set)
    out = model.predict(x)
    return out


def processing():
    conn = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM health_data;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    rows = drop_column(rows)
    rows = replace_gender(rows)
    rows = replace_none_with_zero(rows)
    rows = replace_weight(rows)
    return rows
