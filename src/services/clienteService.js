import ClienteRepositorie from "../repositories/clienteRepositorie.js"
import { AppError } from "../utils/AppError.js"; 

class ClienteService {

    static salvarCliente = async (cliente) => {
        if(cliente.id_cliente){
            return await ClienteRepositorie.atualizarCliente(cliente);
        } else {
            return await ClienteRepositorie.cadastrarCliente(cliente);
        }
    }

    static buscarCliente = async () => {
        return await ClienteRepositorie.buscarClientes();
    }

    static buscarClientePorId = async (id) => {
        const cliente = await ClienteRepositorie.buscarClientePorId(id);
        if (!cliente) {
            throw new AppError('Cliente não encontrado', 404);
        }
        return cliente;
    }

    static deletarCliente = async (id) => {
        const linhasAfetadas = await ClienteRepositorie.deletarCliente(id);

        if(linhasAfetadas == 0){
            throw new AppError('Cliente não encontrado', 404);
        }
    }
}

export default ClienteService;