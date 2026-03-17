import ApiResponse from "../api/ApiResponse.js";

class ClienteCtrl {

    static cadastrarCliente = async (req, res) => {
        try{
            const cliente = req.body;
            const resp = new ApiResponse(true, cliente, 'Cliente cadastrado com sucesso!')
            res.status(201).json(resp)
            
        } catch (e) {
            const resp = new ApiResponse(false, undefined, `Erro ao cadastrar cliente: ${e}`)
            res.status(500).json(resp)
        }
    } 

}

export default ClienteCtrl;