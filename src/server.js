const express = require("express");
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

const rutaProductos = require(path.resolve(__dirname,"./router/routerProducts"));
const rutaCarrito = require(path.resolve(__dirname,"./router/routerCart"));


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((err, req, res, next) => {
    res.status(500).send({error: err.message})
})

app.use("/api/productos", rutaProductos);
app.use("/api/carrito", rutaCarrito);

app.all('*', (req, res) => {
    res.status(404).json({
        error: -2 , 
        descripcion: `Ruta: ${req.originalUrl} Metodo: ${req.method} no implementada`
    })
})
app.listen(PORT, ()=> console.log(`Server running on port: http://localhost:${PORT}`));