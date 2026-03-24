import ApiResponse from "../api/ApiResponse.js";
import ClienteService from "../services/clienteService.js";
import { AppError } from "../utils/AppError.js";

class ClienteCtrl {

    static cadastrarCliente = async (req, res, next) => {
        try {
            const cliente = req.body;
            const data = await ClienteService.cadastrarCliente(cliente);
            const resp = new ApiResponse(true, data, 'Cliente cadastrado com sucesso!');
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

    static deletarCliente = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id) || id <= 0) {
                throw new AppError('ID inválido', 400);
            }

            await ClienteService.deleterCliente(id);

            const resp = new ApiResponse(true, null, 'Cliente deletado com sucesso!');
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

}

export default ClienteCtrl;