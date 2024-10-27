from dbm import error
import os

import numpy as np
import psycopg2
# matplotlib.pyplot as plt
from dotenv import load_dotenv

load_dotenv()


# y = ax + b
def calculate_slope(x,y): # a, коэфф наклона
    mx = x - np.mean(x)
    my = y - np.mean(y)
    return np.sum(mx * my) / np.sum(mx ** 2)


def get_a(x,y):
    a = calculate_slope(x,y)
    return a


def get_b(x,y):
    a = get_a(x,y)
    b = np.mean(y) - a * np.mean(x)
    return b


def connect():
    conn = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM sleep;")
    rows = cur.fetchall()
    conn.close()
    return rows

def ins(durr, feedback):
    conn = psycopg2.connect(
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432'))
    cur = conn.cursor()
    # connect()
    # args_str = ','.join(cur.mogrify("(%s,%s)", x) for x in val)
    cur.execute("INSERT INTO sleep VALUES (%s, %s)",[durr, feedback])
    print("INSERT успешно")
    conn.commit()
    cur.close()
    conn.close()


def predict_again(w0, w1, x_scale):
    y_pred = w0 + w1*x_scale # for val in x_scale
    return y_pred


# def coefficient_reg_inv(x, y):
#     size = len(x)
#     # формируем и заполняем матрицу размерностью 2x2
#     A = np.empty((2, 2))
#     A[[0], [0]] = sum((x[i]) ** 2 for i in range(0, size))
#     A[[0], [1]] = sum(x)
#     A[[1], [0]] = sum(x)
#     A[[1], [1]] = size
#     # находим обратную матрицу
#     A = np.linalg.inv(A)
#     # формируем и заполняем матрицу размерностью 2x1
#     C = np.empty((2, 1))
#     C[0] = sum((x[i] * y[i]) for i in range(0, size))
#     C[1] = sum((y[i]) for i in range(0, size))
#
#     # умножаем матрицу на вектор
#     ww = np.dot(A, C)
#     return ww[1], ww[0]


def analyze_sleep(durr, feedback):
    rows = connect()
    x = np.array([row[1] for row in rows])
    y = np.array([row[0] for row in rows])
    a = get_a(x, y)
    b = get_b(x,y)
    print("a,b", a,b)
    #plt.plot(x,y, "o", label="Данные для обучения")
    x_test = [0, 10]
    y_test = [b, 10 * a + b ]
    #plt.plot(x_test, y_test, label="Расчет")
    #plt.xlabel("Оценка сна")
    #plt.ylabel("Продолжительность сна")
    initial_pred = a * durr + b
    deviation = (feedback - initial_pred) ** 2 # должны уменьшить
    # numpy.dot(x, y)(deviation, 0)
    learning_rate = 0.1

    # old_feedback = feedback

    a += learning_rate * deviation * np.sum(x - np.mean(x)) / np.sum((x - np.mean(x)) ** 2)
    b += learning_rate * deviation
    #if feedback < old_feedback:
    # a = np.sum((x-np.mean(x))*(y-np.mean(y))) /np.sum(np.mean(x**2 - (np.mean(x))**2))
    # b = np.sum(np.mean(y) - a * x)
    #a -= learning_rate * deviation * np.sum(x - np.mean(x)) / np.sum((x - np.mean(x)) ** 2)
    #b -= learning_rate * deviation
    #[b, a] = coefficient_reg_inv(x, y)

    print("new a, new b:", a,b)
    # predict_again(b,a,durr)


    x_in = durr
    # x_in.append(durr)
    recommend = a * x_in + b

    #plt.plot(x_in, recommend, "x",label="Исходный расчет")

    # plt.plot(recommend, )
    # if feedback >
    # if update = update(a,b,feedback)
    # print(recommend)
    #plt.legend()
    #plt.show()
    return round(recommend)


if __name__ == '__main__':
    connect()
    current_duration = 7.78
    feedback = 1
    ins(current_duration, feedback)
    prediction = analyze_sleep(current_duration, feedback)
    print("Рекомендация:",prediction)