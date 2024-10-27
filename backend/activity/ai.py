import os

import numpy as np
import psycopg2
from dotenv import load_dotenv

load_dotenv()


class LinearRegression:
    def init(self):
        self.weights = None

    def fit(self, X, y):
        X_T_X_inv = np.linalg.pinv(X.T @ X)
        self.weights = X_T_X_inv @ X.T @ y

    def predict(self, X):
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
            1 if value == 'Normal' or value == 'Normal Weight'
            else 2 if value == 'Overweight'
            else 3 if value == 'Obese' else value
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


def analyze_activity(gender, age, weight, height, sleep_duration,
                     quality_of_sleep):
    if not gender or not age or not weight or not height or not sleep_duration or not quality_of_sleep:
        return None
    bmi = bmi_category(weight / (height))
    x = np.array([[int(gender), int(age), float(sleep_duration),
                   int(quality_of_sleep), bmi]])
    rows = processing()
    daily_steps = predicts(rows, x)
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
