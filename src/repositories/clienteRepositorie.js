import pool from '../connection/connection.js'

class ClienteRepositorie {

    static cadastrarCliente = async (cliente) => {

        const sql = `
            INSERT INTO clientes 
                (nome, cpf, rg, naturalidade, telefone, data_nascimento)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.rg,
            cliente.naturalidade,
            cliente.telefone,
            cliente.dataNascimento
        ];

        const result = await pool.query(sql, values);
        return result.rows[0];
    }

}

export default ClienteRepositorie;