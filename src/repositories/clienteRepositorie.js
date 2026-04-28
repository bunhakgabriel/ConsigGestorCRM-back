import pool from '../connection/connection.js'

class ClienteRepositorie {

    static cadastrarCliente = async (cliente) => {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            let sql = `
                INSERT INTO clientes
                (
                    cpf,
                    nome,
                    sexo,
                    data_nascimento,
                    naturalidade,
                    nacionalidade_id,
                    rg,
                    data_emissao_rg,
                    orgao_emissao_rg,
                    uf_rg,
                    telefone_1,
                    telefone_2,
                    telefone_3,
                    observacoes,
                    email,
                    nome_pai,
                    nome_mae,
                    grau_instrucao_id,
                    estado_civil_id,
                    endereco_correspondencia,
                    num_dependentes
                )
                VALUES
                (
                    $1,  $2,  $3,  $4,  $5,  $6,
                    $7,  $8,  $9,  $10, $11, $12,
                    $13, $14, $15, $16, $17, $18,
                    $19, $20, $21
                )
                RETURNING *;
            `;

            let values = [
                cliente.cpf ?? null,
                cliente.nome ?? null,
                cliente.sexo ?? null,
                cliente.data_nascimento ?? null,
                cliente.naturalidade ?? null,
                cliente.nacionalidade ?? null,
                cliente.rg ?? null,
                cliente.data_emissao_rg ?? null,
                cliente.orgao_emissor_rg ?? null,
                cliente.uf_rg ?? null,
                cliente.telefone_1 ?? null,
                cliente.telefone_2 ?? null,
                cliente.telefone_3 ?? null,
                cliente.observacoes ?? null,
                cliente.email ?? null,
                cliente.nome_pai ?? null,
                cliente.nome_mae ?? null,
                cliente.grau_instrucao ?? null,
                cliente.estado_civil ?? null,
                cliente.endereco_correspondencia ?? null,
                cliente.num_dependentes ?? null
            ];

            let resultCliente = await client.query(sql, values);
            resultCliente = resultCliente.rows[0];

            // Insert de endereço do cliente
            sql = `
                INSERT INTO enderecos
                (
                    cliente_id,
                    cep,
                    rua,
                    cidade_estado,
                    bairro,
                    numero,
                    complemento
                )
                VALUES
                ($1, $2, $3, $4, $5, $6, $7)
                RETURNING*;
            `;

            values = [
                resultCliente.id_cliente,
                cliente.endereco.cep ?? null,
                cliente.endereco.rua ?? null,
                cliente.endereco.cidade_estado ?? null,
                cliente.endereco.bairro ?? null,
                cliente.endereco.numero ?? null,
                cliente.endereco.complemento ?? null,
            ]

            let resultEndereco = await client.query(sql, values);
            resultEndereco = resultEndereco.rows[0];

            // insert do conjugue do cliente
            sql = `
                INSERT INTO conjugue
                (
                    cliente_id,
                    nome,
                    data_nascimento,
                    documento,
                    naturalidade
                )
                VALUES
                ($1, $2, $3, $4, $5)
                RETURNING*;
            `;

            values = [
                resultCliente.id_cliente,
                cliente.conjugue.nome ?? null,
                cliente.conjugue.data_nascimento ?? null,
                cliente.conjugue.documento ?? null,
                cliente.conjugue.naturalidade ?? null,
            ]

            let resultConjugue = await client.query(sql, values);
            resultConjugue = resultConjugue.rows[0];

            //Insert de informações bancárias
            values = [];
            let placeholders = [];

            cliente.info_bancarias.forEach((info, index) => {
                const baseIndex = index * 5;

                placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`);

                values.push(
                    resultCliente.id_cliente,
                    info.banco ?? null,
                    info.agencia ?? null,
                    info.tipo_conta ?? null,
                    info.conta ?? null
                );
            });

            sql = `
                INSERT INTO info_bancarias (
                    cliente_id,
                    banco_id,
                    agencia,
                    tipo_conta,
                    conta
                )
                VALUES ${placeholders.join(', ')}
                RETURNING*;
            `;

            let resultInfoBancarias = await client.query(sql, values);
            resultInfoBancarias = resultInfoBancarias.rows;

            //Insert de informações beneficio
            values = [];
            placeholders = [];

            cliente.info_beneficio.forEach((info, index) => {
                const baseIndex = index * 4;

                placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);

                values.push(
                    resultCliente.id_cliente,
                    info.convenio ?? null,
                    info.margem ?? null,
                    info.beneficio ?? null
                );
            });

            sql = `
                INSERT INTO info_beneficios (
                    cliente_id,
                    convenio_id,
                    margem,
                    beneficio
                )
                VALUES ${placeholders.join(', ')}
                RETURNING*;
            `;

            let resultInfoBeneficio = await client.query(sql, values);
            resultInfoBeneficio = resultInfoBeneficio.rows;

            await client.query("COMMIT");

            resultCliente.endereco = resultEndereco;
            resultCliente.conjugue = resultConjugue;
            resultCliente.info_bancarias = resultInfoBancarias;
            resultCliente.info_beneficio = resultInfoBeneficio;

            return { ...resultCliente };

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    }

    static atualizarCliente = async (cliente) => {
        const sql = `
            UPDATE clientes
            SET nome = $1,
                cpf = $2,
                rg = $3,
                naturalidade = $4,
                telefone_1 = $5,
                data_nascimento = $6
            WHERE id_cliente = $7
            RETURNING *;
        `;

        const values = [
            cliente.nome,
            cliente.cpf,
            cliente.rg,
            cliente.naturalidade,
            cliente.telefone_1,
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
            const camposValidos = ['nome', 'cpf', 'rg', 'naturalidade', 'telefone_1', 'data_nascimento', 'id_cliente'];
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
        const { nome, cpf, rg, naturalidade, telefone_1, data_nascimento } = filtros

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
            if (telefone_1) {
                values.push(`%${telefone_1.filter}%`);
                conditions.push(`telefone_1 ILIKE $${values.length} `);
            }
            if (data_nascimento) {
                values.push(`%${data_nascimento.filter}%`);
                conditions.push(`data_nascimento ILIKE $${values.length} `);
            }
        }
    }

    static uploadDocumentos = async (idCliente, urlDocumentos) => {
        const values = []
        const placeholders = []

        urlDocumentos.forEach((url, index) => {
            const baseIndex = index * 2

            placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2})`);
            values.push(idCliente, url);
        })
        

        const sql = `
            INSERT INTO documentos (cliente_id, url)
            VALUES ${placeholders.join(', ')}
            RETURNING*;
        `

        const resultDocumentos = await pool.query(sql, values);
        return resultDocumentos.rows;
    }

}

export default ClienteRepositorie;