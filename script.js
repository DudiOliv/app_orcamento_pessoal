/**
 * @class Despesa
 * @classdesc Representa uma despesa financeira com informações como ano, mês, dia, tipo, descrição e valor.
 */
class Despesa {
  /**
   * @constructor
   * @param {string} ano - O ano da despesa (formato YYYY).
   * @param {string} mes - O mês da despesa (formato MM).
   * @param {string} dia - O dia da despesa (formato DD).
   * @param {string} tipo - O tipo da despesa (ex: 'Alimentacao', 'Educação').
   * @param {string} descricao - Uma descrição detalhada da despesa.
   * @param {string} valor - O valor da despesa.
   */
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  /**
   * @method validarDados
   * @description Valida se todos os dados essenciais da despesa foram preenchidos.
   * @returns {boolean} - Retorna true se todos os dados são válidos, false caso contrário.
   */
  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

/**
 * @class Bd
 * @classdesc Classe responsável por interagir com o armazenamento local (localStorage) para persistir e recuperar dados de despesas.
 */
class Bd {
  /**
   * @constructor
   * @description Inicializa o identificador único ('id') para as despesas no localStorage, caso não exista ou seja inválido.
   */
  constructor() {
    let id = localStorage.getItem("id");
    if (id === null || isNaN(parseInt(id))) {
      localStorage.setItem("id", 0);
    }
  }

  /**
   * @method getProximoId
   * @description Obtém o próximo identificador único para uma nova despesa.
   * @returns {number} - O próximo ID disponível para uma despesa.
   */
  getProximoId() {
    let id = localStorage.getItem("id");
    if (isNaN(parseInt(id))) {
      localStorage.setItem("id", 0);
      return 1;
    }
    return parseInt(id) + 1;
  }

  /**
   * @method gravar
   * @description Salva um objeto de despesa no localStorage, utilizando um ID único como chave.
   * @param {Despesa} d - O objeto da despesa a ser gravado.
   */
  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }

  /**
   * @method recuperarTodosRegistros
   * @description Recupera todos os registros de despesas armazenados no localStorage.
   * @returns {Array<Despesa>} - Um array contendo todos os objetos de despesa recuperados.
   */
  recuperarTodosRegistros() {
    let despesas = [];
    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));

      if (despesa == null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  /**
   * @method pesquisar
   * @description Filtra os registros de despesas com base nos critérios fornecidos no objeto de despesa.
   * @param {Despesa} despesa - Um objeto contendo os critérios de pesquisa (campos preenchidos serão considerados).
   * @returns {Array<Despesa>} - Um array contendo as despesas que correspondem aos critérios de pesquisa.
   */
  pesquisar(despesa) {
    let despesasFiltradas = this.recuperarTodosRegistros();

    if (despesa.ano !== "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }

    if (despesa.mes !== "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    if (despesa.dia !== "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    if (despesa.tipo !== "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    if (despesa.descricao !== "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    if (despesa.valor !== "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }
    return despesasFiltradas;
  }

  /**
   * @method remover
   * @description Remove um registro de despesa do localStorage com base no ID fornecido.
   * @param {number} id - O ID do registro de despesa a ser removido.
   */
  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

/**
 * @function cadastrarDespesa
 * @description Obtém os valores do formulário de despesa, cria um novo objeto Despesa,
 * valida os dados e, se válidos, salva a despesa no localStorage e exibe uma mensagem
 * de sucesso. Se os dados forem inválidos, exibe uma mensagem de erro.
 */
function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    bd.gravar(despesa);
    document.getElementById("modal_title").innerHTML =
      "Registro inserido com sucesso";
    document.getElementById("modalTitleDiv").className =
      "modal-header text-success";
    document.getElementById("modalConteudo").innerHTML =
      "Despesa foi cadastrada com  sucesso";
    document.getElementById("buttonTitle").innerHTML = "Voltar";
    document.getElementById("buttonTitle").className = "btn btn-success";

    $("#modalRegistraDespesa").modal("show");

    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";
  } else {
    document.getElementById("modal_title").innerHTML =
      "Registro inserido com sucesso";
    document.getElementById("modalTitleDiv").className =
      "modal-header text-danger";
    document.getElementById("modalConteudo").innerHTML =
      "Erro, algum campo  obrigatório não esta preenchido";
    document.getElementById("buttonTitle").innerHTML = "Voltar e Corrigir";
    document.getElementById("buttonTitle").className = "btn btn-danger";

    $("#modalRegistraDespesa").modal("show");
  }
}

/**
 * @function carregaListaDespesa
 * @description Carrega e exibe a lista de despesas na tabela. Se um array de despesas
 * for fornecido, exibe essa lista; caso contrário, recupera todos os registros do localStorage.
 * @param {Array<Despesa>} [despesas=[]] - Um array opcional de despesas a serem exibidas.
 * @param {boolean} [filtro=false] - Um indicador se a lista é resultado de um filtro.
 */
function carregaListaDespesa(despesas = [], filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  let listaDespesa = document.getElementById("listaDespesas");
  listaDespesa.innerHTML = "";

  despesas.forEach(function (d) {
    let linha = listaDespesa.insertRow();

    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

    switch (d.tipo) {
      case "1":
        d.tipo = "Alimentacao";
        break;
      case "2":
        d.tipo = "Educação";
        break;
      case "3":
        d.tipo = "Lazer";
        break;
      case "4":
        d.tipo = "Saúde";
        break;
      case "5":
        d.tipo = "Transporte";
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;
    //botao exlcluir

    let btn = document.createElement("button");
    linha.insertCell(4).append(btn);
    btn.className = "btn btn-danger";
    btn.innerHTML = "<i class='fas fa-times'></i>";
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");
      bd.remover(id);
      window.location.reload();
    };
  });
}

/**
 * @function pesquisarDespesa
 * @description Obtém os valores do formulário de pesquisa, cria um objeto Despesa
 * com esses valores e chama a função de pesquisa no objeto Bd para filtrar as despesas.
 * Em seguida, atualiza a lista de despesas exibida com os resultados da pesquisa.
 */
function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let valor = document.getElementById("valor").value;
  let descricao = document.getElementById("descricao").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  let despesas = bd.pesquisar(despesa);
  carregaListaDespesa(despesas, true);
}

/**
 * @function recarregarpagina
 * @description Recarrega a página atual do navegador.
 */
function recarregarpagina() {
  window.location.reload();
}
