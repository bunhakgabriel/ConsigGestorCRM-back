import ClienteRepositorie from "../repositories/clienteRepositorie.js"

class ClienteService {
    static cadastrarCliente = async (cliente) => {
        await ClienteRepositorie.cadastrarCliente(cliente)
    }
}

export default ClienteService;