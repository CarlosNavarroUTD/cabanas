from conexion import create_connection, close_connection

class Reserva:
    def __init__(self, id_reserva, id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad=None):
        self.id_reserva = id_reserva
        self.id_cliente = id_cliente
        self.id_cabana = id_cabana
        self.fecha_inicio = fecha_inicio
        self.fecha_fin = fecha_fin
        self.precio_final = precio_final
        self.id_empleado = id_empleado
        self.id_actividad = id_actividad

    @staticmethod
    def crear(id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad=None):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            INSERT INTO Reserva (id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad))
            connection.commit()
            id_reserva = cursor.lastrowid
            close_connection(connection, cursor)
            return Reserva(id_reserva, id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad)
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def leer(id_reserva):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT * FROM Reserva WHERE id_reserva = %s"
            cursor.execute(query, (id_reserva,))
            data = cursor.fetchone()
            close_connection(connection, cursor)
            if data:
                return Reserva(*data)
            else:
                print("Reserva no encontrada.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    def actualizar(self, id_cliente=None, id_cabana=None, fecha_inicio=None, fecha_fin=None, precio_final=None, id_empleado=None, id_actividad=None):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            UPDATE Reserva
            SET id_cliente = COALESCE(%s, id_cliente),
                id_cabana = COALESCE(%s, id_cabana),
                fecha_inicio = COALESCE(%s, fecha_inicio),
                fecha_fin = COALESCE(%s, fecha_fin),
                precio_final = COALESCE(%s, precio_final),
                id_empleado = COALESCE(%s, id_empleado),
                id_actividad = COALESCE(%s, id_actividad)
            WHERE id_reserva = %s
            """
            cursor.execute(query, (id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado, id_actividad, self.id_reserva))
            connection.commit()
            close_connection(connection, cursor)
            print("Reserva actualizada con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    @staticmethod
    def eliminar(id_reserva):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "DELETE FROM Reserva WHERE id_reserva = %s"
            cursor.execute(query, (id_reserva,))
            connection.commit()
            close_connection(connection, cursor)
            print("Reserva eliminada con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")
