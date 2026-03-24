import ClienteRepositorie from "../repositories/clienteRepositorie.js"
import { AppError } from "../utils/AppError.js"; 

class ClienteService {

    static cadastrarCliente = async (cliente) => {
        return await ClienteRepositorie.cadastrarCliente(cliente);
    }

    static buscarCliente = async () => {
        return await ClienteRepositorie.buscarClientes();
    }

    static deleterCliente = async (id) => {
        const linhasAfetadas = await ClienteRepositorie.deletarCliente(id);

        if(linhasAfetadas == 0){
            throw new AppError('Cliente não encontrado', 404);
        }

        return;
    }
}

export default ClienteService;