import ClienteRepositorie from "../repositories/clienteRepositorie.js"

class ClienteService {

    static cadastrarCliente = async (cliente) => {
        return await ClienteRepositorie.cadastrarCliente(cliente);
    }

    static buscarCliente = async () => {
        return await ClienteRepositorie.buscarClientes();
    }
}

export default ClienteService;