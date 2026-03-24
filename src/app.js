import express from "express"
import route from "./routes/index.js"
import { errorHandler } from "../middlewares/errorHandler.js"

const app = express()

app.use(express.json())

route(app)

app.use(errorHandler)

export default app;