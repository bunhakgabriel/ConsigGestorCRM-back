import clienteRoutes from "../routes/clienteRoutes.js"
import authMiddleware from "../middlewares/authMiddleware.js"
// import express from 'express'
// import path from "path";
import referenceDataRoutes from "../routes/referenceDataRoutes.js"

const route = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("Bem vindo a api ConsigGestorCRM!")
    })

    // app.use("/documentos", express.static(path.resolve("documentos")));

    app.get("/auth/me", authMiddleware, (req, res) => {
        const user = req.user;

        return res.json({
            email: user.email,
            uid: user.uid,
        });
    });

    app.use(authMiddleware)
    app.use(clienteRoutes)
    app.use(referenceDataRoutes)
}

export default route