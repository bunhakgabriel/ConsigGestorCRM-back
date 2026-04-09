import ReferenceDataService from "../services/referenceDataService.js";
import ApiResponse from "../api/ApiResponse.js";

class ReferenceDataCltr {

    static buscarUfs = (req, res, next) => {
        try {
            const data = ReferenceDataService.carregamentoSimplesUfs();

            const resp =
                new ApiResponse(
                    true,
                    data,
                    'Realizado com sucesso!'
                );

            res.status(200).json(resp);
        } catch (error) {
            next(error)
        }
    }

}

export default ReferenceDataCltr;