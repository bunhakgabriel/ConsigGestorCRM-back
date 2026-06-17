import app from "./src/app.js";

const port = process.env.PORT || 8000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escutando em http://0.0.0.0:${port}`)
})