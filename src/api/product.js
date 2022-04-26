const fs = require('fs').promises;
const moment = require("moment");
const path = require('path');

class Productos { 
    constructor() {
        this.filePath = path.resolve(__dirname,'../../data/products.json');
        this.data = [];
        this.id = 0;
    }
    
    async getAll() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");  
            if (data) {
                this.data = JSON.parse(data); 
                this.data.map((product) => {this.id < product.id? this.id = product.id : ""});
            return this.data;
            }
            document.getElementById("NuevaTabla").innerHTML = this.filePath;
        } catch (error) {
            if (error.code == 'ENOENT'){
                await fs.writeFile(this.filePath, '')
            return []
            }
            throw new Error(`Error no capturado: ${error.message}`)
            }
    }

    async saveProduct(product){
        try{
            const x = await this.getAll();
            this.id++
            const addNewProduct = {
                id: this.id,  
                timestamp: moment().format('L LTS'),
                nombre: product.nombre,
                descripcion: product.descripcion,
                codigo: product.codigo,
                foto: product.foto,
                precio: product.precio,
                stock: product.stock
            }
            x.push(addNewProduct)
            await fs.writeFile(this.filePath, JSON.stringify(x, null, 2));
        } catch(error){
            throw new Error("Se produjo un error al guardar el producto : " +  error.message)
        }
    }

    async getById(id) {
        try {
            await this.getAll();
            const productById = this.data.find((prod) => prod.id === parseInt(id));
            if (productById) {
                return productById
            } else {
                console.log(`No se encontro el producto con id: ${id}`);
            }
        } catch (error) {
            console.log("Error " + error);
        }
    }  

    async  updateProduct(id, product) {
        try {
            const yyy = await this.getAll();
            const productById = yyy.find((prod) => prod.id === parseInt(id));
            if (productById) {
                const updProduct = {
                    id: parseInt(id), 
                    timestamp: moment().format('L LTS'),
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    codigo: product.codigo,
                    foto: product.foto,
                    precio: product.precio,
                    stock: product.stock
                }
                const findIndex = yyy.findIndex((prod) => prod.id === parseInt(id))
                yyy[findIndex] = updProduct
                await fs.writeFile(this.filePath, JSON.stringify(yyy, null, 2));
                return updProduct
            } else {
                console.log(`No se encontro el producto con id: ${id}`);
            }
        } catch (error) {
            console.log("Error actualizar: " + error);
        }
    }

    async borrar(id) {
        try {
            const todosLosProductos = await this.getAll();
            const deleteIndex = todosLosProductos.findIndex((product) => product.id == parseInt(id))
        
            if (deleteIndex != -1) {
                todosLosProductos.splice(deleteIndex, 1);
                await fs.writeFile(this.filePath, JSON.stringify(todosLosProductos, null, 2))
            }
            return 1
        } catch (error) {
            console.log(`Error borrar: ${error.message}`)
        }
    }
}

module.exports = Productos;