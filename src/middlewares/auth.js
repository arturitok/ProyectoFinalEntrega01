
const admin = rol => {
    return (req, res ,next) => {
        if (rol) {
            next()
        } else {
            res.status(403).json({
                error: -1 , 
                descripcion: `Ruta: ${req.originalUrl} Metodo: ${req.method} no autorizada`
            })
        }
    }
}
module.exports = admin;