import mysql.connector

def create_connection():
    config = {
        'user': 'root',
        'password': '2014',
        'host': 'localhost',
        'database': 'bd_cabanas',
        'charset': 'utf8mb4',
        'collation': 'utf8mb4_general_ci'
    }
    
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        return cursor, connection
    except mysql.connector.Error as err:
        print(f"Error al conectar a la base de datos: {err}")
        return None, None

def close_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()
