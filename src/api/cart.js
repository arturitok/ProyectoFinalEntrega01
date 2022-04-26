const fs = require('fs').promises
const moment = require('moment')
const path = require('path')

class Carritos {
    constructor() {
        this.filePath =  path.resolve(__dirname,'../../data/cart.json')
        this.cart = []
        this.id = 1
    }

    async getAllCart() {
        try{
            const listaCarrito = await fs.readFile(this.filePath)
            if(listaCarrito.toString() != ''){
                this.cart = JSON.parse(listaCarrito)
                this.id = this.cart[this.cart.length -1].id +1
            }
            return this.cart
        }catch(error){
            if( error.code == "ENOENT"){
                    fs.writeFile(this.filePath,'')
                    return []
            }
            console.log("Error " + error)
        }
    }

    async createCart() {
        try{
            const carts = await this.getAllCart()
            const nuevoCarr = {
                id: this.id, 
                timestamp: moment().format('L LTS'),
                products: []
            }
            carts.push(nuevoCarr)
            await fs.writeFile(this.filePath, JSON.stringify(carts ,null, 2))
            return nuevoCarr
        }catch(error){
            console.log("Error " + error)
        }
    }

    async deleteCart(idCarrito) { 
        try {
            const carts = await this.getAllCart()
            const deleteI = carts.findIndex((cart) => cart.id === parseInt(idCarrito))

            if (deleteI === -1 ){
                return -1
            } else{
                const deleteData = carts.splice(deleteI,1)
                await fs.writeFile(this.filePath, JSON.stringify(carts ,null, 2))
                return deleteData
            }
        }catch (error) {
            console.log("Error " + error)
        }
    }

    async listProductsInCart(idCarrito) {
        try {
            const carts = await this.getAllCart()
            const cartPorId = carts.find(cart => cart.id == parseInt(idCarrito))
            return cartPorId.products
        }catch (error) {
            console.log("Error " + error)
        }
    }

    async addProductInCart(idCarrito, product) {
        try {
            const carts = await this.getAllCart()
            const cartPorId = carts.find(cart => cart.id == parseInt(idCarrito))
            if (cartPorId) {
                cartPorId.products.push(product)
                await fs.writeFile(this.filePath, JSON.stringify(carts ,null, 2))
                return cartPorId
            }else {
                throw new Error("No se encontró el carrito")
            }
            
        }catch (error) {
            throw new Error(error.message)
        }
    }
    
    async deleteProductInCart(idCarrito, idProducto) {
        try{
            const carts = await this.getAllCart()
            const cartPorId = carts.find(cart => cart.id == parseInt(idCarrito))
            if(cartPorId){
                const cartIndex = carts.findIndex((cart) => cart.id === parseInt(idCarrito))
                const deleteI = cartPorId.products.findIndex((prod) => prod.id === parseInt(idProducto))
                if (deleteI != -1 ){
                    cartPorId.products.splice(deleteI,1)
                    carts[cartIndex] = cartPorId
                    await fs.writeFile(this.filePath, JSON.stringify(carts ,null, 2))
                    return cartPorId
                }
            }else {
                throw new Error("No se encontró el carrito")
            }

        }catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Carritos