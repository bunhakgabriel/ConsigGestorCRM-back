import ApiResponse from "../api/ApiResponse.js";
import VendedorService from "../services/vendedorService.js";
import { AppError } from "../utils/AppError.js";

class VendedorCtrl {

    static salvarVendedor = async (req, res, next) => {
        try {
            const vendedor = req.body;
            const data = await VendedorService.salvarVendedor(vendedor);
            const resp = new ApiResponse(true, data, 'Vendedor salvo com sucesso!');
            res.status(201).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static buscarVendedores = async (req, res, next) => {
        try {
            const params = req.body.params;
            const { data, total } = await VendedorService.buscarVendedores(params);

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

    static buscarVendedorPorId = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                throw new AppError('ID inválido', 400)
            }

            const data = await VendedorService.buscarVendedorPorId(id);
            const resp = new ApiResponse(true, data);
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

    static deletarVendedor = async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                throw new AppError('ID inválido', 400)
            }

            await VendedorService.deletarVendedor(id);

            const resp = new ApiResponse(true, null, 'Vendedor deletado com sucesso!');
            res.status(200).json(resp);
        } catch (e) {
            next(e);
        }
    }

}

export default VendedorCtrl;