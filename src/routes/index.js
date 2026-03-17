import clienteRoutes from "../routes/clienteRoutes.js"

const route = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("Bem vindo a api ConsigGestorCRM!")
    })

    app.use(clienteRoutes)
}

export default route