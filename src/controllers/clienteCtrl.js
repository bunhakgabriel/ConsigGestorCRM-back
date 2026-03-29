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
            const data = await ClienteService.buscarCliente();
            const resp = new ApiResponse(true, data);
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

}

export default ClienteCtrl;