# 2026---Segundo-Cuatrimestre---TP-Integrador
## Primer avance: servidor con Express

Armamos el servidor del Autoservicio en la carpeta `backend`. Por ahora
tiene una ruta de prueba que muestra un mensaje de bienvenida. La usamos
para comprobar que el servidor arranca y responde.

### Como probarlo

Desde la carpeta principal del proyecto, ejecuta:

```powershell
cd backend
npm install
npm start```

Abri http://localhost:3000 en el navegador. Si aparece «Bienvenido al
servidor del Autoservicio», la prueba salio bien.


##Segundo avance: base de datos y productos##

Conectamos el servidor a SQLite usando Sequelize Creamos el modelo
Producto para guardar zapatillas y camisetas en una misma tabla.
El campo categoria permite distinguirlas.

Para probarlo, entramos a backend, ejecutamos npm install y después
npm start. Al arrancar, se crea database.sqlite si es q todavía no existe.