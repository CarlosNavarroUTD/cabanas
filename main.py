import tkinter as tk
from tkinter import messagebox, ttk
from Empleados.empleado import Empleado
from Reserva.reserva import Reserva
from Clientes.cliente import Cliente
from Cabanas.cabana import Cabana
from Actividades.actividad import Actividad
from tkcalendar import DateEntry
from datetime import datetime



class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Gestión de Cabañas")
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

        tk.Label(self.root, text="Puesto").pack()
        puestos = ["Admin", "Seller"]
        puesto_var = tk.StringVar(self.root)
        puesto_var.set(puestos[0])  
        puesto_menu = tk.OptionMenu(self.root, puesto_var, *puestos)
        puesto_menu.pack()

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
            puesto = puesto_var.get()  # Obtener el valor seleccionado

            nuevo_empleado = Empleado.registrarse(nombre, apellido, puesto, dni, contrasena)
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
        tk.Button(self.root, text="Registrar Actividad", command=self.registrar_actividad).pack(pady=10)
        tk.Button(self.root, text="Cerrar Sesión", command=self.cerrar_sesion).pack(pady=10)


    def mostrar_formulario_reserva(self):
        self.clear_window()
        self.pantalla_anterior = self.mostrar_menu_principal

        tk.Label(self.root, text="Registrar Reserva", font=("Arial", 16)).pack(pady=20)

        # Campo para el DNI del cliente
        tk.Label(self.root, text="DNI Cliente").pack()
        dni_cliente_entry = tk.Entry(self.root)
        dni_cliente_entry.pack()

        # Campo para seleccionar la cabaña
        tk.Label(self.root, text="Cabaña").pack()
        cabanas = Cabana.getAll()
        cabana_opciones = [f"{cabana.id_cabana} - {cabana.nombre}" for cabana in cabanas]
        id_cabana_combobox = ttk.Combobox(self.root, values=cabana_opciones)
        id_cabana_combobox.pack()

        # Campo para seleccionar la fecha de inicio
        tk.Label(self.root, text="Fecha de Inicio").pack()
        fecha_inicio_entry = DateEntry(self.root, width=16, background='darkblue',
                                    foreground='white', borderwidth=2, year=2023)
        fecha_inicio_entry.pack()

        # Campo para seleccionar la fecha de fin
        tk.Label(self.root, text="Fecha de Fin").pack()
        fecha_fin_entry = DateEntry(self.root, width=16, background='darkblue',
                                    foreground='white', borderwidth=2, year=2023)
        fecha_fin_entry.pack()

        # Campo para seleccionar una actividad (opcional)
        tk.Label(self.root, text="¿Desea agregar una actividad?").pack()
        actividades = Actividad.getAll()  # Obtener todas las actividades
        actividad_opciones = [f"{actividad.id_actividad} - {actividad.nombre}" for actividad in actividades]
        id_actividad_combobox = ttk.Combobox(self.root, values=actividad_opciones)
        id_actividad_combobox.pack()

        capacidad_label = tk.Label(self.root, text="")
        capacidad_label.pack()

        cantidad_label = tk.Label(self.root, text="")
        cantidad_entry = tk.Entry(self.root)
        cantidad_label.pack()
        cantidad_entry.pack()

        # Campo para mostrar el precio final
        precio_final_label = tk.Label(self.root, text="Precio Final: $0")
        precio_final_label.pack()

        # Actualizar el precio final cuando se selecciona la cabaña o la actividad
        def actualizar_precio_final(*args):
            id_cabana = id_cabana_combobox.get().split(" - ")[0]
            cabana_seleccionada = next((cabana for cabana in cabanas if str(cabana.id_cabana) == id_cabana), None)
            id_actividad = id_actividad_combobox.get().split(" - ")[0] if id_actividad_combobox.get() else None
            actividad_seleccionada = next((actividad for actividad in actividades if str(actividad.id_actividad) == id_actividad), None)

            # Calcular el número de noches
            fecha_inicio = fecha_inicio_entry.get_date()
            fecha_fin = fecha_fin_entry.get_date()
            numero_noches = (fecha_fin - fecha_inicio).days

            # Calcular el precio final
            precio_final = cabana_seleccionada.costo_por_noche * numero_noches if cabana_seleccionada else 0

            if actividad_seleccionada:
                capacidad_label.config(text=f"Capacidad: {actividad_seleccionada.capacidad}")
                cantidad_label.config(text=f"Cantidad de {actividad_seleccionada.nombre}:")
                cantidad = int(cantidad_entry.get()) if cantidad_entry.get().isdigit() else 0
                precio_final += actividad_seleccionada.costo * cantidad

            precio_final_label.config(text=f"Precio Final: ${precio_final}")

        id_cabana_combobox.bind("<<ComboboxSelected>>", actualizar_precio_final)
        id_actividad_combobox.bind("<<ComboboxSelected>>", actualizar_precio_final)
        cantidad_entry.bind("<KeyRelease>", actualizar_precio_final)

        def on_submit():
            dni_cliente = dni_cliente_entry.get()
            id_cabana = id_cabana_combobox.get().split(" - ")[0]
            fecha_inicio = fecha_inicio_entry.get()
            fecha_fin = fecha_fin_entry.get()
            id_actividad = id_actividad_combobox.get().split(" - ")[0] if id_actividad_combobox.get() else None
            cantidad = int(cantidad_entry.get()) if cantidad_entry.get().isdigit() else 0


            
            cliente = Cliente.search_by_dnicliente(dni_cliente)
            if cliente:
                id_cliente = cliente.id_cliente
            else:
                messagebox.showwarning("Advertencia", "Cliente no encontrado. Se creará uno nuevo.")

            precio_final = float(precio_final_label.cget("text").split("$")[1])

            # Crear la reserva
            reserva = Reserva.crear(id_cliente, id_cabana, fecha_inicio, fecha_fin, precio_final, self.current_empleado.id_empleado)
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

    def registrar_actividad(self):
        self.clear_window()
        self.pantalla_anterior = self.mostrar_menu_principal

        tk.Label(self.root, text="Registrar Actividad", font=("Arial", 16)).pack(pady=20)

        tk.Label(self.root, text="Nombre").pack()
        nombre_entry = tk.Entry(self.root)
        nombre_entry.pack()

        tk.Label(self.root, text="Costo").pack()
        costo_entry = tk.Entry(self.root)
        costo_entry.pack()

        tk.Label(self.root, text="Capacidad").pack()
        capacidad_entry = tk.Entry(self.root)
        capacidad_entry.pack()

        def on_submit():
            nombre = nombre_entry.get()
            costo = costo_entry.get()
            capacidad = capacidad_entry.get()

            actividad = Actividad.crear(nombre, costo, capacidad)  # Sin id_actividad
            if actividad:
                messagebox.showinfo("Éxito", "Actividad registrada exitosamente.")
                self.mostrar_menu_principal()
            else:
                messagebox.showerror("Error", "No se pudo registrar la actividad.")

        tk.Button(self.root, text="Registrar Actividad", command=on_submit).pack(pady=10)
        tk.Button(self.root, text="Volver", command=self.volver_a_pantalla_anterior).pack(pady=10)


    def cerrar_sesion(self):
        self.current_empleado = None
        self.main_menu()

    def clear_window(self):
        for widget in self.root.winfo_children():
            widget.destroy()

    def volver_a_pantalla_anterior(self):
        if hasattr(self, 'pantalla_anterior') and self.pantalla_anterior:
            self.pantalla_anterior()
        else:
            self.main_menu()

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
