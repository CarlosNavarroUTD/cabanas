from conexion import create_connection, close_connection
from funciones import hash_password

class Empleado:
    def __init__(self, id_empleado, nombre, apellido, dni, contrasena=None):
        self.id_empleado = id_empleado
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.contrasena = hash_password(contrasena) if contrasena else None

    @staticmethod
    def iniciar_sesion(dni, contrasena):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT id_empleado, nombre, apellido, dni, contrasena FROM Empleado WHERE dni = %s"
            cursor.execute(query, (dni,))
            empleado_data = cursor.fetchone()
            close_connection(connection, cursor)
            
            if empleado_data and empleado_data[4] == hash_password(contrasena):
                return Empleado(*empleado_data[:4])
            else:
                print("DNI o contraseña incorrectos.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def registrarse(nombre, apellido, dni, contrasena):
        cursor, connection = create_connection()
        if cursor and connection:
            # Verificar si el DNI ya está registrado
            query = "SELECT dni FROM Empleado WHERE dni = %s"
            cursor.execute(query, (dni,))
            if cursor.fetchone():
                print("El DNI ya está registrado.")
                close_connection(connection, cursor)
                return None
            
            # Insertar el nuevo empleado en la base de datos
            query = """
            INSERT INTO Empleado (nombre, apellido, dni, contrasena)
            VALUES (%s, %s, %s, %s)
            """
            hashed_password = hash_password(contrasena)
            cursor.execute(query, (nombre, apellido, dni, hashed_password))
            connection.commit()

            # Obtener el ID del nuevo empleado
            id_empleado = cursor.lastrowid

            # Crear una instancia de Empleado
            nuevo_empleado = Empleado(id_empleado, nombre, apellido, dni, hashed_password)
            print("Registro exitoso.")
            close_connection(connection, cursor)
            return nuevo_empleado
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None


    def guiar(self):
        pass  # Implementar la funcionalidad en el futuro

    def administrar(self):
        pass  # Implementar la funcionalidad en el futuro
