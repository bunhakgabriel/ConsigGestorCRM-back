function mapCliente(cliente) {
  return {
    id_cliente: cliente.id_cliente,
    cpf: cliente.cpf,
    nome: cliente.nome,
    sexo: cliente.sexo,
    data_nascimento: cliente.data_nascimento,
    naturalidade: cliente.naturalidade,

    nacionalidade: cliente.nacionalidade_id,

    rg: cliente.rg,
    data_emissao_rg: cliente.data_emissao_rg,
    orgao_emissor_rg: cliente.orgao_emissao_rg,
    uf_rg: cliente.uf_rg,

    telefone_1: cliente.telefone_1,
    telefone_2: cliente.telefone_2,
    telefone_3: cliente.telefone_3,

    observacoes: cliente.observacoes,
    email: cliente.email,

    nome_pai: cliente.nome_pai,
    nome_mae: cliente.nome_mae,

    grau_instrucao: cliente.grau_instrucao_id,
    estado_civil: cliente.estado_civil_id,

    endereco_correspondencia: cliente.endereco_correspondencia,
    num_dependentes: cliente.num_dependentes,

    documentos: (cliente.documentos || []).map(doc => ({
      file: null,
      url: process.env.BASE_URL + doc.url ?? null
    })),

    endereco: {
      cep: cliente.endereco?.cep ?? null,
      rua: cliente.endereco?.rua ?? null,
      cidade_estado: cliente.endereco?.cidade_estado ?? null,
      bairro: cliente.endereco?.bairro ?? null,
      numero: cliente.endereco?.numero ?? null,
      complemento: cliente.endereco?.complemento ?? null
    },

    conjugue: {
      nome: cliente.conjugue?.nome ?? null,
      data_nascimento: cliente.conjugue?.data_nascimento ?? null,
      documento: cliente.conjugue?.documento ?? null,
      naturalidade: cliente.conjugue?.naturalidade ?? null
    },

    info_bancarias: (cliente.info_bancarias || []).map(b => ({
      id: b.id_info_bancarias,
      banco: b.banco_id ?? b.banco,
      agencia: b.agencia,
      tipo_conta: b.tipo_conta,
      conta: b.conta
    })),

    info_beneficio: (cliente.info_beneficio || []).map(b => ({
      id: b.id_info_beneficio,
      beneficio: b.beneficio,
      convenio: b.convenio_id ?? b.convenio,
      margem: b.margem !== null && b.margem !== undefined ? Number(b.margem) : null
    }))
  };
}

export default mapCliente;