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

        const { take, skip, filtros, ordenacao } = params

        let sql = 'SELECT * FROM clientes ';

        const values = [];
        const conditions = [];

        this.#filtrosClientes(filtros, values, conditions);

        if (conditions.length > 0) {
            sql += 'WHERE ' + conditions.join(' AND ');
        }

        if (ordenacao.length) {
            const camposValidos = ['nome', 'cpf', 'rg', 'naturalidade', 'telefone', 'data_nascimento', 'id_cliente'];
            const campoOrdenacao = camposValidos.includes(ordenacao[0].colId) ? ordenacao[0].colId : 'id_cliente';

            const ordem = ordenacao[0].sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

            sql += ` ORDER BY ${campoOrdenacao} ${ordem} `;
        } else {
            sql += 'ORDER BY id_cliente ';
        }

        values.push(Number(take) || 10)
        values.push(Number(skip) || 0)

        sql += `LIMIT $${values.length - 1} OFFSET $${values.length}`;

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

    static totalClientes = async (filtros) => {

        let sql = 'SELECT COUNT(*) AS total FROM clientes '

        const values = [];
        const conditions = [];

        this.#filtrosClientes(filtros, values, conditions);

        if (conditions && conditions.length > 0) {
            sql += 'WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(sql, values);
        return result.rows[0].total;
    }

    static #filtrosClientes = (filtros, values, conditions) => {
        const { nome, cpf, rg, naturalidade, telefone, data_nascimento } = filtros

        if (Object.keys(filtros).length) {
            if (nome) {
                values.push(`%${nome.filter}%`);
                conditions.push(`nome ILIKE $${values.length} `);
            }
            if (cpf) {
                values.push(`%${cpf.filter}%`);
                conditions.push(`cpf ILIKE $${values.length} `);
            }
            if (rg) {
                values.push(`%${rg.filter}%`);
                conditions.push(`rg ILIKE $${values.length} `);
            }
            if (naturalidade) {
                values.push(`%${naturalidade.filter}%`);
                conditions.push(`naturalidade ILIKE $${values.length} `);
            }
            if (telefone) {
                values.push(`%${telefone.filter}%`);
                conditions.push(`telefone ILIKE $${values.length} `);
            }
            if (data_nascimento) {
                values.push(`%${data_nascimento.filter}%`);
                conditions.push(`data_nascimento ILIKE $${values.length} `);
            }
        }
    }

}

export default ClienteRepositorie;