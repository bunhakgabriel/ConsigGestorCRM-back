import ClienteRepositorie from "../repositories/clienteRepositorie.js"
import { AppError } from "../utils/AppError.js";
import mapCliente from "./mappers/clienteMapper.js";

class ClienteService {

    static salvarCliente = async (data) => {
        if (data.id_cliente) {
            return await ClienteRepositorie.atualizarCliente(data);
        } else {
            const cliente = await ClienteRepositorie.cadastrarCliente(data);
            return mapCliente(cliente);
        }
    }

    static buscarClientes = async (params) => {
        const clientes = await ClienteRepositorie.buscarClientes(params);
        const totalClientes = await ClienteRepositorie.totalClientes(params?.filtros);

        const total = Number(totalClientes);

        if (!Number.isFinite(total)) {
            throw new AppError('Erro ao calcular total de registros!', 500);
        }

        return { data: clientes, total };
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

        if (linhasAfetadas == 0) {
            throw new AppError('Cliente não encontrado', 404);
        }
    }
}

export default ClienteService;