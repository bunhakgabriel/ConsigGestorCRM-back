import ClienteRepositorie from "../repositories/clienteRepositorie.js"
import { AppError } from "../utils/AppError.js";
import mapCliente from "./mappers/clienteMapper.js";
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

class ClienteService {

    static salvarCliente = async (data) => {
        if (data.id_cliente) {
            const cliente = await ClienteRepositorie.atualizarCliente(data);
            return mapCliente(cliente);
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
        return mapCliente(cliente);
    }

    static deletarCliente = async (id) => {
        const linhasAfetadas = await ClienteRepositorie.deletarCliente(id);

        if (linhasAfetadas == 0) {
            throw new AppError('Cliente não encontrado', 404);
        }
    }

    static uploadDocumentos = async (idCliente, documentos) => {
        // Pasta base
        const pastaBase = path.resolve('documentos');

        // Pasta do cliente
        const pastaCliente = path.join(pastaBase, String(idCliente));

        // Cria a pasta se não existir
        await fs.promises.mkdir(pastaCliente, { recursive: true });

        const urlDocumentos = []
        for (const file of documentos) {

            // Remove espaços do nome original (opcional mas recomendado)
            const nomeOriginal = file.originalname.replace(/\s+/g, '_');

            // Gera nome único com UUID
            const nomeArquivo = `${randomUUID()}-${nomeOriginal}`;

            const caminho = path.join(pastaCliente, nomeArquivo);

            fs.writeFileSync(caminho, file.buffer);

            const url = `/documentos/${idCliente}/${nomeArquivo}`;
            urlDocumentos.push(url);
        }

        return ClienteRepositorie.uploadDocumentos(idCliente, urlDocumentos);
    }
}

export default ClienteService;