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
            cliente.data_nascimento
        ];

        const result = await pool.query(sql, values);
        return result.rows[0];
    }

    static buscarClientes = async () => {
        const sql = 'SELECT * FROM clientes';
        const result = await pool.query(sql);
        return result.rows;
    }

    static buscarClientePorId = async (id) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = $1';
        const values = [id];
        const result = await pool.query(sql, values);
        return result.rows[0];
    }

    static deletarCliente = async (id) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = $1';
        const values = [id];
        const result = await pool.query(sql, values);
        return result.rowCount;
    }

}

export default ClienteRepositorie;