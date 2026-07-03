import pool from "../connection/connection.js";

class VendedorRepositorie {

    static cadastrarVendedor = async (vendedor) => {
        let sql = `
            INSERT INTO vendedores (nome, telefone, observacoes) VALUES ($1, $2, $3) RETURNING *;
        `

        let values = [vendedor.nome, vendedor.telefone, vendedor.observacoes];

        const result = await pool.query(sql, values);
        return result.rows[0];
    }

    static buscarVendedores = async (params) => {

        const { take, skip, filtros, ordenacao } = params

        let sql = 'SELECT * FROM vendedores';

        const values = [];
        const conditions = [];

        this.#filtrosVendedores(filtros, values, conditions);

        if (conditions.length > 0) {
            sql += 'WHERE ' + conditions.join(' AND ');
        }

        if (ordenacao.length) {
            const camposValidos = ['nome', 'telefone', 'observacoes', 'id_vendedor'];
            const campoOrdenacao = camposValidos.includes(ordenacao[0].colId) ? ordenacao[0].colId : 'id_vendedor';

            const ordem = ordenacao[0].sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

            sql += ` ORDER BY ${campoOrdenacao} ${ordem} `;
        } else {
            sql += 'ORDER BY id_vendedor ';
        }

        values.push(Number(take) || 10)
        values.push(Number(skip) || 0)

        sql += `LIMIT $${values.length - 1} OFFSET $${values.length}`;

        const result = await pool.query(sql, values);
        return result.rows;
    }

    static buscarVendedorPorId = async (id) => {
        let sql = 'SELECT * FROM vendedores WHERE id_vendedor = $1';
        let values = [id];
        let resultVendedor = await pool.query(sql, values);
        return resultVendedor.rows[0];
    }

    static deletarVendedor = async (id) => {
        const sql = 'DELETE FROM vendedores WHERE id_vendedor = $1';
        const values = [id];
        const result = await pool.query(sql, values);
        return result.rowCount;
    }

    static totalVendedores = async (filtros) => {

        let sql = 'SELECT COUNT(*) AS total FROM vendedores'

        const values = [];
        const conditions = [];

        this.#filtrosVendedores(filtros, values, conditions);

        if (conditions && conditions.length > 0) {
            sql += 'WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(sql, values);
        return result.rows[0].total;
    }

    static #filtrosVendedores = (filtros, values, conditions) => {
        const { nome, telefone, observacoes } = filtros

        if (Object.keys(filtros).length) {
            if (nome) {
                values.push(`%${nome.filter}%`);
                conditions.push(`nome ILIKE $${values.length} `);
            }
            if (telefone) {
                values.push(`%${telefone.filter}%`);
                conditions.push(`telefone ILIKE $${values.length} `);
            }
            if (observacoes) {
                values.push(`%${observacoes.filter}%`);
                conditions.push(`observacoes ILIKE $${values.length} `);
            }
        }
    }

}

export default VendedorRepositorie;