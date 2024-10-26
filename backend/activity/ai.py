import time
import psycopg2
import numpy as np

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
def normalize_to_range(array):
    min_value = np.min(array)
    max_value = np.max(array)
    normalized_array = (array - min_value) / (max_value - min_value)
    return normalized_array
def drop_column(rows):
    return [row[:3]+row[4:6]+ row[8:9]+row[11:12] for row in rows]
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
    elif(19<bmi<=40):
        return 2
    else:
        return 3

def analyze_activity(gender, age, sleep_duration=8, quality_of_sleep=5, weight=50, height=180):
    bmi = bmi_category(weight/(height))
    x=np.array([[int(gender), int(age), float(sleep_duration), int(quality_of_sleep), bmi]])
    rows = processing()
    daily_steps = predicts(rows, x)
    return daily_steps
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
    conn = psycopg2.connect(database="Steps", user="postgres", password="235711", host="localhost", port="5432")
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
