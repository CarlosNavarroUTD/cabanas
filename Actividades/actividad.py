from conexion import create_connection, close_connection

class Actividad:
    def __init__(self, id_actividad, nombre, costo, capacidad):
        self.id_actividad = id_actividad
        self.nombre = nombre
        self.costo = costo
        self.capacidad = capacidad

    @staticmethod
    def crear(nombre, costo, capacidad):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            INSERT INTO Actividad (nombre, costo, capacidad)
            VALUES (%s, %s, %s)
            """
            cursor.execute(query, (nombre, costo, capacidad))
            connection.commit()

            # Obtener el id autogenerado
            id_actividad = cursor.lastrowid
            close_connection(connection, cursor)
            return Actividad(id_actividad, nombre, costo, capacidad)
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def leer(id_actividad):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT * FROM Actividad WHERE id_actividad = %s"
            cursor.execute(query, (id_actividad,))
            data = cursor.fetchone()
            close_connection(connection, cursor)
            if data:
                return Actividad(*data)
            else:
                print("Actividad no encontrada.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    def actualizar(self, nombre=None, costo=None, capacidad=None):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            UPDATE Actividad
            SET nombre = COALESCE(%s, nombre),
                costo = COALESCE(%s, costo),
                capacidad = COALESCE(%s, capacidad)
            WHERE id_actividad = %s
            """
            cursor.execute(query, (nombre, costo, capacidad, self.id_actividad))
            connection.commit()
            close_connection(connection, cursor)
            print("Actividad actualizada con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    @staticmethod
    def eliminar(id_actividad):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "DELETE FROM Actividad WHERE id_actividad = %s"
            cursor.execute(query, (id_actividad,))
            connection.commit()
            close_connection(connection, cursor)
            print("Actividad eliminada con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    @staticmethod
    def getAll():
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT * FROM Actividad"
            cursor.execute(query)
            data = cursor.fetchall()
            close_connection(connection, cursor)
            return [Actividad(*row) for row in data]
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return []
