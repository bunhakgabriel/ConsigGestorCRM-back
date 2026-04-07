import clienteRoutes from "../routes/clienteRoutes.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const route = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("Bem vindo a api ConsigGestorCRM!")
    })

    app.get("/auth/me", authMiddleware, (req, res) => {
        const user = req.user;

        return res.json({
            email: user.email,
            uid: user.uid,
        });
    });

    app.use(authMiddleware, clienteRoutes)
}

export default route