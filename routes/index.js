const route = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("Bem vindo a api ConsigGestorCRM!")
    })
}

export default route