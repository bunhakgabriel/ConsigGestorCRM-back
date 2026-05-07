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
            if (cliente.endereco) {
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
                resultCliente.endereco = resultEndereco.rows[0];
            }

            // insert do conjugue do cliente
            if (cliente.conjugue) {
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
                resultCliente.conjugue = resultConjugue.rows[0];
            }

            //Insert de informações bancárias
            if (cliente.info_bancarias.length > 0) {
                let values = [];
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
                resultCliente.info_bancarias = resultInfoBancarias.rows;
            }

            //Insert de informações beneficio
            if (cliente.info_beneficio.length > 0) {
                let values = [];
                let placeholders = [];

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
                resultCliente.info_beneficio = resultInfoBeneficio.rows;
            }

            await client.query("COMMIT");

            return { ...resultCliente };

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    }

    static atualizarCliente = async (cliente) => {
        const client = await pool.connect();

        try {
            await client.query("BEGIN")

            let sql = `
                UPDATE clientes
                SET nome = $1,
                    sexo = $2,
                    data_nascimento = $3,
                    naturalidade = $4,
                    nacionalidade_id = $5,
                    data_emissao_rg = $6,
                    orgao_emissao_rg = $7,
                    uf_rg = $8,
                    telefone_1 = $9,
                    telefone_2 = $10,
                    telefone_3 = $11,
                    observacoes = $12,
                    email = $13,
                    nome_pai = $14,
                    nome_mae = $15,
                    grau_instrucao_id = $16,
                    estado_civil_id = $17,
                    endereco_correspondencia = $18,
                    num_dependentes = $19
                WHERE id_cliente = $20
                RETURNING *;
            `;

            let values = [
                cliente.nome ?? null,
                cliente.sexo ?? null,
                cliente.data_nascimento ?? null,
                cliente.naturalidade ?? null,
                cliente.nacionalidade ?? null,
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
                cliente.num_dependentes ?? null,
                cliente.id_cliente
            ];

            let resultCliente = await client.query(sql, values);
            resultCliente = resultCliente.rows[0];


            // update de endereço do cliente
            const resultEnderecoExistente = await client.query(
                'SELECT id_endereco FROM enderecos WHERE cliente_id = $1',
                [cliente.id_cliente]
            );

            const enderecoExiste = resultEnderecoExistente.rows.length > 0;

            if (cliente.endereco) {

                values = [
                    cliente.endereco.cep ?? null,
                    cliente.endereco.rua ?? null,
                    cliente.endereco.cidade_estado ?? null,
                    cliente.endereco.bairro ?? null,
                    cliente.endereco.numero ?? null,
                    cliente.endereco.complemento ?? null,
                    cliente.id_cliente
                ]

                if (enderecoExiste) {
                    sql = `
                        UPDATE enderecos
                        SET cep = $1,
                            rua = $2,
                            cidade_estado = $3,
                            bairro = $4,
                            numero = $5,
                            complemento = $6
                        WHERE cliente_id = $7
                        RETURNING*;
                    `;

                    let resultEndereco = await client.query(sql, values);
                    resultCliente.endereco = resultEndereco.rows[0];

                } else {
                    sql = `
                        INSERT INTO enderecos
                        (
                            cep,
                            rua,
                            cidade_estado,
                            bairro,
                            numero,
                            complemento,
                            cliente_id
                        )
                        VALUES
                        ($1, $2, $3, $4, $5, $6, $7)
                        RETURNING*;
                    `;

                    let resultEndereco = await client.query(sql, values);
                    resultCliente.endereco = resultEndereco.rows[0];
                }
            } else {
                if (enderecoExiste) {
                    await client.query(
                        'DELETE FROM enderecos WHERE cliente_id = $1',
                        [cliente.id_cliente]
                    );
                }
            }

            // update de conjugue do cliente
            const resultConjugueExistente = await client.query(
                'SELECT id_conjugue FROM conjugue WHERE cliente_id = $1',
                [cliente.id_cliente]
            );

            const conjugueExiste = resultConjugueExistente.rows.length > 0;

            if (cliente.conjugue) {

                values = [
                    cliente.conjugue.nome ?? null,
                    cliente.conjugue.data_nascimento ?? null,
                    cliente.conjugue.documento ?? null,
                    cliente.conjugue.naturalidade ?? null,
                    cliente.id_cliente
                ]

                if (conjugueExiste) {
                    sql = `
                        UPDATE conjugue
                        SET nome = $1,
                            data_nascimento = $2,
                            documento = $3,
                            naturalidade = $4
                        WHERE cliente_id = $5
                        RETURNING*;
                    `

                    let resultConjugue = await client.query(sql, values);
                    resultCliente.conjugue = resultConjugue.rows[0];

                } else {
                    sql = `
                        INSERT INTO conjugue
                        (
                            nome,
                            data_nascimento,
                            documento,
                            naturalidade,
                            cliente_id
                        )
                        VALUES
                        ($1, $2, $3, $4, $5)
                        RETURNING*;
                    `;

                    let resultConjugue = await client.query(sql, values);
                    resultCliente.conjugue = resultConjugue.rows[0];
                }

            } else {
                if (conjugueExiste) {
                    await client.query(
                        'DELETE from conjugue WHERE cliente_id = $1',
                        [cliente.id_cliente]
                    );
                }
            }

            // update de informações bancárias
            const idsInfoBancariasBanco = ((await client.query(
                'SELECT id_info_bancarias FROM info_bancarias WHERE cliente_id = $1',
                [cliente.id_cliente]
            )).rows).map(i => i.id_info_bancarias)

            const idsFront = cliente.info_bancarias.filter(i => i.id).map(i => i.id);
            const idsInfoBancariasParaDeletar = idsInfoBancariasBanco.filter(id => !idsFront.includes(id));

            if(idsInfoBancariasParaDeletar.length > 0){
                await client.query(
                    'DELETE FROM info_bancarias WHERE id_info_bancarias = ANY($1) AND cliente_id = $2',
                    [idsInfoBancariasParaDeletar, cliente.id_cliente]
                )
            }

            if (cliente.info_bancarias?.length > 0) {
                const infoBancariasUpdate = cliente.info_bancarias.filter(info => info.id);
                const infoBancariasInsert = cliente.info_bancarias.filter(info => !info.id);
                let resultInfoBancarias = [];

                if (infoBancariasUpdate?.length > 0) {
                    let valuesUpdate = [];
                    let placeholdersUpdate = [];

                    infoBancariasUpdate.forEach((info, index) => {
                        const baseIndex = index * 5;

                        placeholdersUpdate.push(`
                            ($${baseIndex + 1}::INTEGER,
                            $${baseIndex + 2}::INTEGER,
                            $${baseIndex + 3}::TEXT,
                            $${baseIndex + 4}::TEXT,
                            $${baseIndex + 5}::TEXT)
                        `);

                        valuesUpdate.push(
                            info.id,
                            info.banco ?? null,
                            info.agencia ?? null,
                            info.tipo_conta ?? null,
                            info.conta ?? null,
                        );
                    });

                    valuesUpdate.push(cliente.id_cliente)

                    sql = `
                        UPDATE info_bancarias AS i
                        SET banco_id = v.banco_id,
                            agencia = v.agencia,
                            tipo_conta = v.tipo_conta,
                            conta = v.conta
                        FROM (
                            VALUES ${placeholdersUpdate.join(', ')}
                        ) AS v(id, banco_id, agencia, tipo_conta, conta)
                        WHERE i.id_info_bancarias = v.id
                        AND i.cliente_id = $${valuesUpdate.length}
                        RETURNING*;
                    `

                    const resultInfoBancariasUpdate = await client.query(sql, valuesUpdate);
                    resultInfoBancarias = [...resultInfoBancarias, ...resultInfoBancariasUpdate.rows]
                }

                if (infoBancariasInsert?.length > 0) {
                    let valuesInsert = [];
                    let placeholdersInsert = [];

                    infoBancariasInsert.forEach((info, index) => {
                        const baseIndex = index * 5;

                        placeholdersInsert.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`);

                        valuesInsert.push(
                            info.banco ?? null,
                            info.agencia ?? null,
                            info.tipo_conta ?? null,
                            info.conta ?? null,
                            cliente.id_cliente,
                        );
                    });

                    sql = `
                        INSERT INTO info_bancarias (
                            banco_id,
                            agencia,
                            tipo_conta,
                            conta,
                            cliente_id
                        )
                        VALUES ${placeholdersInsert.join(', ')}
                        RETURNING*;
                    `;

                    const resultInfoBancariasInsert = await client.query(sql, valuesInsert);
                    resultInfoBancarias = [...resultInfoBancarias, ...resultInfoBancariasInsert.rows];
                }

                resultCliente.info_bancarias = resultInfoBancarias;
            }


            // update de informações do beneficio
            const idsInfoBeneficioBanco = ((await client.query(
                'SELECT id_info_beneficio FROM info_beneficios WHERE cliente_id = $1',
                [cliente.id_cliente]
            )).rows).map(i => i.id_info_beneficio)

            const idsInfoBeneficioFront = cliente.info_beneficio.filter(i => i.id).map(i => i.id);
            const idsInfoBeneficioParaDeletar = idsInfoBeneficioBanco.filter(id => !idsInfoBeneficioFront.includes(id));

            if(idsInfoBeneficioParaDeletar.length > 0){
                await client.query(
                    'DELETE FROM info_beneficios WHERE id_info_beneficio = ANY($1) AND cliente_id = $2',
                    [idsInfoBeneficioParaDeletar, cliente.id_cliente]
                )
            }

            if (cliente.info_beneficio?.length > 0) {
                const infoBeneficioUpdate = cliente.info_beneficio.filter(info => info.id);
                const infoBeneficioInsert = cliente.info_beneficio.filter(info => !info.id);
                let resultInfoBeneficio = [];

                if (infoBeneficioUpdate?.length > 0) {
                    let valuesUpdate = [];
                    let placeholdersUpdate = [];

                    infoBeneficioUpdate.forEach((info, index) => {
                        const baseIndex = index * 4;

                        placeholdersUpdate.push(`
                            ($${baseIndex + 1}::INTEGER,
                            $${baseIndex + 2}::INTEGER,
                            $${baseIndex + 3}::NUMERIC(10,2),
                            $${baseIndex + 4}::INTEGER)
                        `);

                        valuesUpdate.push(
                            info.id,
                            info.convenio ?? null,
                            info.margem ?? null,
                            info.beneficio ?? null
                        );
                    });

                    valuesUpdate.push(cliente.id_cliente)

                    sql = `
                        UPDATE info_beneficios AS i
                        SET convenio_id = v.convenio_id,
                            margem = v.margem,
                            beneficio = v.beneficio
                        FROM (
                            VALUES ${placeholdersUpdate.join(', ')}
                        ) AS v(id, convenio_id, margem, beneficio)
                        WHERE i.id_info_beneficio = v.id
                        AND i.cliente_id = $${valuesUpdate.length}
                        RETURNING*;
                    `

                    const resultInfoBeneficioUpdate = await client.query(sql, valuesUpdate);
                    resultInfoBeneficio = [...resultInfoBeneficio, ...resultInfoBeneficioUpdate.rows]
                }

                if (infoBeneficioInsert?.length > 0) {
                    let valuesInsert = [];
                    let placeholdersInsert = [];

                    infoBeneficioInsert.forEach((info, index) => {
                        const baseIndex = index * 4;

                        placeholdersInsert.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);

                        valuesInsert.push(
                            info.convenio ?? null,
                            info.margem ?? null,
                            info.beneficio ?? null,
                            cliente.id_cliente
                        );
                    });

                    sql = `
                        INSERT INTO info_beneficios (
                            convenio_id,
                            margem,
                            beneficio,
                            cliente_id
                        )
                        VALUES ${placeholdersInsert.join(', ')}
                        RETURNING*;
                    `;

                    const resultInfoBeneficioInsert = await client.query(sql, valuesInsert);
                    resultInfoBeneficio = [...resultInfoBeneficio, ...resultInfoBeneficioInsert.rows];
                }

                resultCliente.info_beneficio = resultInfoBeneficio;
            }

            await client.query("COMMIT");
            return { ...resultCliente };

        } catch (error) {
            await client.query("ROLLBACK")
            throw error
        } finally {
            client.release();
        }
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
        let sql = 'SELECT * FROM clientes WHERE id_cliente = $1';
        let values = [id];
        let resultCliente = await pool.query(sql, values);
        resultCliente = resultCliente.rows[0];

        sql = `SELECT * FROM enderecos WHERE cliente_id = $1`;
        let resultEndereco = await pool.query(sql, values);
        resultEndereco = resultEndereco.rows[0];

        sql = `SELECT * FROM conjugue WHERE cliente_id = $1`;
        let resultConjugue = await pool.query(sql, values);
        resultConjugue = resultConjugue.rows[0];

        sql = `SELECT * FROM info_bancarias WHERE cliente_id = $1`;
        let resultInfoBancarias = await pool.query(sql, values);
        resultInfoBancarias = resultInfoBancarias.rows;

        sql = `SELECT * FROM info_beneficios WHERE cliente_id = $1`;
        let resultInfoBeneficio = await pool.query(sql, values);
        resultInfoBeneficio = resultInfoBeneficio.rows;

        sql = `SELECT * FROM documentos WHERE cliente_id = $1`;
        let resultDocumentos = await pool.query(sql, values);
        resultDocumentos = resultDocumentos.rows;

        resultCliente.endereco = resultEndereco;
        resultCliente.conjugue = resultConjugue;
        resultCliente.info_bancarias = resultInfoBancarias;
        resultCliente.info_beneficio = resultInfoBeneficio;
        resultCliente.documentos = resultDocumentos;

        return resultCliente;
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