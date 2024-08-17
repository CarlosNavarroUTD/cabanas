from conexion import create_connection, close_connection

class Cliente:
    def __init__(self, id_cliente, nombre, apellido, dni, email):
        self.id_cliente = id_cliente
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.email = email

    @staticmethod
    def crear(nombre, apellido, dni, email):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            INSERT INTO Cliente (nombre, apellido, dni, email)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (nombre, apellido, dni, email))
            connection.commit()
            id_cliente = cursor.lastrowid
            close_connection(connection, cursor)
            return Cliente(id_cliente, nombre, apellido, dni, email)
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def leer(id_cliente):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT * FROM Cliente WHERE id_cliente = %s"
            cursor.execute(query, (id_cliente,))
            data = cursor.fetchone()
            close_connection(connection, cursor)
            if data:
                return Cliente(*data)
            else:
                print("Cliente no encontrado.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    def actualizar(self, nombre=None, apellido=None, dni=None, email=None):
        cursor, connection = create_connection()
        if cursor and connection:
            query = """
            UPDATE Cliente
            SET nombre = COALESCE(%s, nombre),
                apellido = COALESCE(%s, apellido),
                dni = COALESCE(%s, dni),
                email = COALESCE(%s, email)
            WHERE id_cliente = %s
            """
            cursor.execute(query, (nombre, apellido, dni, email, self.id_cliente))
            connection.commit()
            close_connection(connection, cursor)
            print("Cliente actualizado con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    @staticmethod
    def eliminar(id_cliente):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "DELETE FROM Cliente WHERE id_cliente = %s"
            cursor.execute(query, (id_cliente,))
            connection.commit()
            close_connection(connection, cursor)
            print("Cliente eliminado con éxito.")
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    @staticmethod
    def search_by_dnicliente(dni):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT * FROM Cliente WHERE dni = %s"
            cursor.execute(query, (dni,))
            data = cursor.fetchone()
            close_connection(connection, cursor)
            if data:
                return Cliente(*data)
            else:
                print("Cliente no encontrado.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None