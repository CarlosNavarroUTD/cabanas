import tkinter as tk
from tkinter import messagebox
from Empleados.empleado import Empleado
from Reserva.reserva import Reserva
from Clientes.cliente import Cliente
from Cabanas.cabana import Cabana

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Gestión de Empleados")
        self.root.geometry("400x300")

        self.current_empleado = None
        self.main_menu()

    def main_menu(self):
        self.clear_window()

        tk.Label(self.root, text="Sistema de Gestión de Empleados", font=("Arial", 16)).pack(pady=20)

        tk.Button(self.root, text="Iniciar Sesión", command=self.iniciar_sesion).pack(pady=10)
        tk.Button(self.root, text="Registrarse", command=self.registrarse).pack(pady=10)

    def iniciar_sesion(self):
        self.clear_window()
        self.pantalla_anterior = self.main_menu

        tk.Label(self.root, text="Iniciar Sesión", font=("Arial", 16)).pack(pady=20)
        tk.Label(self.root, text="DNI").pack()
        dni_entry = tk.Entry(self.root)
        dni_entry.pack()
        tk.Label(self.root, text="Contraseña").pack()
        contrasena_entry = tk.Entry(self.root, show="*")
        contrasena_entry.pack()

        def on_submit():
            dni = dni_entry.get()
            contrasena = contrasena_entry.get()
            self.current_empleado = Empleado.iniciar_sesion(dni, contrasena)
            if self.current_empleado:
                self.mostrar_menu_principal()
            else:
                messagebox.showerror("Error", "DNI o contraseña incorrectos.")

        tk.Button(self.root, text="Iniciar Sesión", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)



    def registrarse(self):
        self.clear_window()
        self.pantalla_anterior = self.main_menu

        tk.Label(self.root, text="Registrarse", font=("Arial", 16)).pack(pady=20)
        tk.Label(self.root, text="Nombre").pack()
        nombre_entry = tk.Entry(self.root)
        nombre_entry.pack()
        tk.Label(self.root, text="Apellido").pack()
        apellido_entry = tk.Entry(self.root)
        apellido_entry.pack()
        tk.Label(self.root, text="DNI").pack()
        dni_entry = tk.Entry(self.root)
        dni_entry.pack()
        tk.Label(self.root, text="Contraseña").pack()
        contrasena_entry = tk.Entry(self.root, show="*")
        contrasena_entry.pack()

        def on_submit():
            nombre = nombre_entry.get()
            apellido = apellido_entry.get()
            dni = dni_entry.get()
            contrasena = contrasena_entry.get()
            nuevo_empleado = Empleado.registrarse(nombre, apellido, dni, contrasena)
            if nuevo_empleado:
                messagebox.showinfo("Éxito", "Registro exitoso.")
                self.main_menu()
            else:
                messagebox.showerror("Error", "No se pudo registrar el empleado.")

        tk.Button(self.root, text="Registrarse", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)


    def mostrar_menu_principal(self):
        self.clear_window()

        tk.Label(self.root, text="Menú Principal", font=("Arial", 16)).pack(pady=20)

        tk.Button(self.root, text="Registrar Reserva", command=self.mostrar_formulario_reserva).pack(pady=10)
        tk.Button(self.root, text="Registrar Cliente", command=self.registrar_cliente).pack(pady=10)
        tk.Button(self.root, text="Registrar Cabaña", command=self.registrar_cabana).pack(pady=10)
        tk.Button(self.root, text="Cerrar Sesión", command=self.cerrar_sesion).pack(pady=10)



    def mostrar_formulario_reserva(self):
        self.clear_window()
        self.pantalla_anterior = self.mostrar_menu_principal

        tk.Label(self.root, text="Registrar Reserva", font=("Arial", 16)).pack(pady=20)
        tk.Label(self.root, text="ID Cliente").pack()
        id_cliente_entry = tk.Entry(self.root)
        id_cliente_entry.pack()
        tk.Label(self.root, text="ID Cabaña").pack()
        id_cabana_entry = tk.Entry(self.root)
        id_cabana_entry.pack()
        tk.Label(self.root, text="Fecha de Inicio").pack()
        fecha_inicio_entry = tk.Entry(self.root)
        fecha_inicio_entry.pack()
        tk.Label(self.root, text="Fecha de Fin").pack()
        fecha_fin_entry = tk.Entry(self.root)
        fecha_fin_entry.pack()
        tk.Label(self.root, text="Precio Final").pack()
        precio_final_entry = tk.Entry(self.root)
        precio_final_entry.pack()
        tk.Label(self.root, text="ID Empleado").pack()
        id_empleado_entry = tk.Entry(self.root)
        id_empleado_entry.pack()

        def on_submit():
            id_cliente = id_cliente_entry.get()
            id_cabana = id_cabana_entry.get()
            fecha_inicio = fecha_inicio_entry.get()
            fecha_fin = fecha_fin_entry.get()
            precio_final = precio_final_entry.get()
            id_empleado = id_empleado_entry.get()

            reserva = Reserva.crear(id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, id_empleado)
            if reserva:
                messagebox.showinfo("Éxito", "Reserva registrada exitosamente.")
            else:
                messagebox.showerror("Error", "No se pudo registrar la reserva.")

        tk.Button(self.root, text="Registrar Reserva", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)



    def registrar_cliente(self):
        self.clear_window()
        self.pantalla_anterior = self.mostrar_menu_principal

        tk.Label(self.root, text="Registrar Cliente", font=("Arial", 16)).pack(pady=20)
        tk.Label(self.root, text="Nombre").pack()
        nombre_entry = tk.Entry(self.root)
        nombre_entry.pack()
        tk.Label(self.root, text="Apellido").pack()
        apellido_entry = tk.Entry(self.root)
        apellido_entry.pack()
        tk.Label(self.root, text="DNI").pack()
        dni_entry = tk.Entry(self.root)
        dni_entry.pack()
        tk.Label(self.root, text="Email").pack()
        email_entry = tk.Entry(self.root)
        email_entry.pack()

        def on_submit():
            nombre = nombre_entry.get()
            apellido = apellido_entry.get()
            dni = dni_entry.get()
            email = email_entry.get()

            cliente = Cliente.crear(nombre, apellido, dni, email)
            if cliente:
                messagebox.showinfo("Éxito", "Cliente registrado exitosamente.")
            else:
                messagebox.showerror("Error", "No se pudo registrar el cliente.")

        tk.Button(self.root, text="Registrar Cliente", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)



    def registrar_cabana(self):
        self.clear_window()
        self.pantalla_anterior = self.mostrar_menu_principal

        tk.Label(self.root, text="Registrar Cabaña", font=("Arial", 16)).pack(pady=20)
        tk.Label(self.root, text="Nombre").pack()
        nombre_entry = tk.Entry(self.root)
        nombre_entry.pack()
        tk.Label(self.root, text="Capacidad").pack()
        capacidad_entry = tk.Entry(self.root)
        capacidad_entry.pack()
        tk.Label(self.root, text="Costo por Noche").pack()
        costo_entry = tk.Entry(self.root)
        costo_entry.pack()
        tk.Label(self.root, text="Disponible (True/False)").pack()
        disponible_entry = tk.Entry(self.root)
        disponible_entry.pack()

        def on_submit():
            nombre = nombre_entry.get()
            capacidad = capacidad_entry.get()
            costo = costo_entry.get()
            disponible = disponible_entry.get().strip().lower() == 'true'

            cabana = Cabana.crear(nombre, capacidad, costo, disponible)
            if cabana:
                messagebox.showinfo("Éxito", "Cabaña registrada exitosamente.")
            else:
                messagebox.showerror("Error", "No se pudo registrar la cabaña.")

        tk.Button(self.root, text="Registrar Cabaña", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)


    def volver_a_pantalla_anterior(self):
        if hasattr(self, 'pantalla_anterior'):
            self.pantalla_anterior()
        else:
            self.main_menu()


    def cerrar_sesion(self):
        self.current_empleado = None
        self.main_menu()

    def clear_window(self):
        for widget in self.root.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
