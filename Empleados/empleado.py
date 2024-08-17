from conexion import create_connection, close_connection
from funciones import hash_password

class Empleado:
    def __init__(self, id_empleado, nombre, apellido, puesto, dni, contrasena=None):
        self.id_empleado = id_empleado
        self.nombre = nombre
        self.apellido = apellido
        self.puesto = puesto
        self.dni = dni
        self.contrasena = contrasena

    @staticmethod
    def iniciar_sesion(dni, contrasena):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT id_empleado, nombre, apellido, puesto, dni, contrasena FROM Empleado WHERE dni = %s"
            cursor.execute(query, (dni,))
            empleado_data = cursor.fetchone()
            close_connection(connection, cursor)
            
            if empleado_data and empleado_data[5] == hash_password(contrasena):
                return Empleado(*empleado_data[:5])
            else:
                print("DNI o contraseña incorrectos.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def registrarse(nombre, apellido, puesto, dni, contrasena):
        # Crear la conexión y el cursor
        cursor, connection = create_connection()

        if cursor and connection:
            try:
                # Verificar si el DNI ya está registrado
                query = "SELECT dni FROM Empleado WHERE dni = %s"
                cursor.execute(query, (dni,))
                if cursor.fetchone():
                    print("El DNI ya está registrado.")
                    return None
                
                # Insertar el nuevo empleado en la base de datos
                query = """
                INSERT INTO Empleado (nombre, apellido, puesto, dni, contrasena)
                VALUES (%s, %s, %s, %s, %s)
                """
                hashed_password = hash_password(contrasena)
                cursor.execute(query, (nombre, apellido, puesto, dni, hashed_password))
                connection.commit()

                # Obtener el ID del nuevo empleado
                id_empleado = cursor.lastrowid

                # Crear una instancia de Empleado
                nuevo_empleado = Empleado(id_empleado, nombre, apellido, puesto, dni, hashed_password)
                print("Registro exitoso.")
                return nuevo_empleado

            finally:
                # Cerrar la conexión y el cursor
                close_connection(connection, cursor)
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    @staticmethod
    def get_by_id(id_empleado):
        cursor, connection = create_connection()
        if cursor and connection:
            query = "SELECT id_empleado, nombre, apellido, puesto, dni FROM Empleado WHERE id_empleado = %s"
            cursor.execute(query, (id_empleado,))
            empleado_data = cursor.fetchone()
            close_connection(connection, cursor)
            
            if empleado_data:
                return Empleado(*empleado_data)
            else:
                print("Empleado no encontrado.")
                return None
        else:
            print("No se pudo establecer la conexión con la base de datos.")
            return None

    def actualizar(self, nombre=None, apellido=None, puesto=None, dni=None, contrasena=None):
        cursor, connection = create_connection()
        if cursor and connection:
            updates = []
            values = []
            if nombre:
                updates.append("nombre = %s")
                values.append(nombre)
                self.nombre = nombre
            if apellido:
                updates.append("apellido = %s")
                values.append(apellido)
                self.apellido = apellido
            if puesto:
                updates.append("puesto = %s")
                values.append(puesto)
                self.puesto = puesto
            if dni:
                updates.append("dni = %s")
                values.append(dni)
                self.dni = dni
            if contrasena:
                updates.append("contrasena = %s")
                values.append(hash_password(contrasena))

            if updates:
                query = f"UPDATE Empleado SET {', '.join(updates)} WHERE id_empleado = %s"
                values.append(self.id_empleado)
                cursor.execute(query, tuple(values))
                connection.commit()
                print("Empleado actualizado con éxito.")
            else:
                print("No se proporcionaron datos para actualizar.")

            close_connection(connection, cursor)
        else:
            print("No se pudo establecer la conexión con la base de datos.")

    def guiar(self):
        pass  # Implementar la funcionalidad en el futuro

    def administrar(self):
        pass  # Implementar la funcionalidad en el futuro