import VendedorRepositorie from "../repositories/vendedorRepositorie.js"
import { AppError } from "../utils/AppError.js";

class VendedorService {

    static salvarVendedor = async (data) => {
        if (data.id_vendedor) {
            return await VendedorRepositorie.atualizarVendedor(data);
        } else {
            return await VendedorRepositorie.cadastrarVendedor(data);
        }
    }

    static buscarVendedores = async (params) => {
        const vendedores = await VendedorRepositorie.buscarVendedores(params);
        const totalVendedores = await VendedorRepositorie.totalVendedores(params?.filtros);

        const total = Number(totalVendedores);

        if (!Number.isFinite(total)) {
            throw new AppError('Erro ao calcular total de registros!', 500);
        }

        return { data: vendedores, total };
    }

    static buscarVendedorPorId = async (id) => {
        const vendedor = await VendedorRepositorie.buscarVendedorPorId(id);
        if (!vendedor) {
            throw new AppError('Vendedor não encontrado', 404);
        }
        return vendedor;
    }

    static deletarVendedor = async (id) => {
        const linhasAfetadas = await VendedorRepositorie.deletarVendedor(id);

        if (linhasAfetadas == 0) {
            throw new AppError('Vendedor não encontrado', 404);
        }
    }

}

export default VendedorService;