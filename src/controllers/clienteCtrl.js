import ApiResponse from "../api/ApiResponse.js";
import ClienteService from "../services/clienteService.js";
import { AppError } from "../utils/AppError.js";

class ClienteCtrl {

    static salvarCliente = async (req, res, next) => {
        try {
            const cliente = req.body;
            const data = await ClienteService.salvarCliente(cliente);
            const resp = new ApiResponse(true, data, 'Cliente salvo com sucesso!');
            res.status(201).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static buscarClientes = async (req, res, next) => {
        try {
            const params = req.body.params;
            const { data, total } = await ClienteService.buscarClientes(params);

            const resp =
                new ApiResponse(
                    true,
                    data,
                    'Realizado com sucesso!',
                    { total }
                );

            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static buscarClientePorId = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                throw new AppError('ID inválido', 400)
            }

            const data = await ClienteService.buscarClientePorId(id);
            const resp = new ApiResponse(true, data);
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static deletarCliente = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                throw new AppError('ID inválido', 400)
            }

            await ClienteService.deletarCliente(id);

            const resp = new ApiResponse(true, null, 'Cliente deletado com sucesso!');
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static uploadDocumentos = async (req, res, next) => {
        try {
            const idCliente = Number(req.params.id);
            const documentos = req.files;

            if(!documentos || documentos?.length == 0 ){
                res.status(200).json(new ApiResponse(false, null, 'Nenhum documento enviado!'))
            }

            const data = await ClienteService.uploadDocumentos(idCliente, documentos)

            const resp = new ApiResponse(true, null, 'Documentos salvos com sucesso!');
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

}

export default ClienteCtrl;