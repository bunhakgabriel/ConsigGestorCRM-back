import express from "express"
import route from "../routes/index.js"

const app = express()

route(app)

export default app;