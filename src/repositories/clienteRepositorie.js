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

    static atualizarCliente = async (cliente) => {
        const sql = `
            UPDATE clientes
            SET nome = $1,
                cpf = $2,
                rg = $3,
                naturalidade = $4,
                telefone = $5,
                data_nascimento = $6
            WHERE id_cliente = $7
            RETURNING *;
        `;

        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.rg,
            cliente.naturalidade,
            cliente.telefone,
            cliente.data_nascimento,
            cliente.id_cliente
        ];

        const result = await pool.query(sql, values);
        return result.rows[0];
    }

    static buscarClientes = async (params) => {

        const { take, skip } = params
        const sql = 'SELECT * FROM clientes ORDER BY id_cliente LIMIT $1 OFFSET $2';

        const values = [
            Number(take) || 10,
            Number(skip) || 0 
        ]

        const result = await pool.query(sql, values);
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

    static totalClientes = async () => {
        const sql = 'SELECT COUNT(*) AS total FROM clientes;'
        const result = await pool.query(sql);
        return result.rows[0].total;
    }

}

export default ClienteRepositorie;