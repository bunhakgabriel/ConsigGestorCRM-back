import ClienteRepositorie from "../repositories/clienteRepositorie.js"

class ClienteService {
    static cadastrarCliente = async (cliente) => {
        return await ClienteRepositorie.cadastrarCliente(cliente)
    }
}

export default ClienteService;