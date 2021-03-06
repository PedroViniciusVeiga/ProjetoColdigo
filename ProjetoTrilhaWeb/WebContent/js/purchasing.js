COLDIGO.compra = new Object();

$(document).ready(function() {

	/*********************************
		Funções do Mestre Detalhe
	*********************************/

	/* Função para carregar as marcas nos campos do formulário*/

	//Carrega as marcas registradas no BD no select do formulário, usando o id para fazer iso no campo certo
	COLDIGO.compra.carregarMarcas = function(id) {

		//Recebe valores de todos os campos de marca do form e armazena em camposMarcas
		var camposMarcas = document.getElementsByName("selMarca[]");

		//Inicia o ajax que busca no BD as marcas cadastradas
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marcas/buscar",
			success: function(marcas) {
				$(camposMarcas[id]).html("");

				//se houver mais de uma marca nesse obj
				if (marcas.length) {
					//Cria uma opção vazia, para validarmos o campo depois
					var option = document.createElement("option");
					option.setAttribute("value", "");
					option.innerHTML = ("Escolha");
					//coloca o campo no select correto
					$(camposMarcas[id]).append(option);


					//para cada marca...
					for (var i = 0; i < marcas.length; i++) {
						//cria uma opção com o valor do id e o nome da marca
						var option = document.createElement("option");
						option.setAttribute("value", marcas[i].id);
						option.innerHTML = (marcas[i].nome);
						//coloca essa opção no select
						$(camposMarcas[id]).append(option);
					}
					//senão tiver no bd
				} else {
					//Cria uma opção destacando que deve-se cruar uma marca primeiro
					var option = document.createElement("option");
					option.setAttribute("value", "");
					option.innerHTML = ("Cadastre uma marca primeiro!");
					//Adiciona uma classe que destaca essa opção em vermelho
					$(camposMarcas[id]).addClass("aviso");
					//coloca a opção no select
					$(camposMarcas[id]).append(option);
				}
				//fim do success
			},
			//Se der erro 
			error: function(info) {
				//Exibe aviso
				COLDIGO.exibirAviso("Erro ao buscar as marcas: " + info.status + " - " + info.statusText);
				//Cria opção de erro e a coloca no select, adicionando uma classe que destaca a opção em vermelho
				$(camposMarcas[id]).html("");
				var option = document.createElement("option");
				option.setAttribute("value", "");
				option.innerHTML = ("Erro ao carregar marcas!");
				$(camposMarcas[id]).addClass("aviso");
				$(camposMarcas[id]).append(option);
			}
		});

	}

	//Executa a função ao carregar a página, afetando a unica opção de marca disponivel(0)
	COLDIGO.compra.carregarMarcas(0);


	/* Função para CRIAR uma nova linha no detalhe do form*/

	//Ao clicar no botão add
	$(".botaoAdd").click(function() {

		//cria um clone da primeira linha e salva na "novoCampo"
		var novoCampo = $("tr.detalhes:first").clone();

		//Esvazia os inputs do clone
		novoCampo.find("input").val("");

		//Insere o clone na página, logo após a ultima linha
		novoCampo.insertAfter("tr.detalhes:last");



	});


	/* Função para REMOVER uma nova linha no detalhe do form*/



	COLDIGO.compra.removeCampo = function(botao) {
		//se houver mais de uma no MD
		if ($("tr.detalhes").length > 1) {
			//remove a linha que contem o botão
			//o segundo parent é a linha onde esta o botão

			$(botao).parent().parent().remove();
			//senão é porque só tem uma linha
		} else {
			//avisa que não pode remover
			COLDIGO.exibirAviso("A última linha não pode ser removida")
		}
		//fecha a função
	}

	/* Função para validar os campos do formulário*/

	COLDIGO.compra.validaDetalhe = function() {
		//Recebe os produtos preenchidos
		var produtosValidar = document.getElementsByName("selProduto[]");
		//Recebe as quantidades preenchidas
		var qtdeValidar = document.getElementsByName("txtQuantidade[]");
		var valorValidar = document.getElementsByName("txtValor[]");
		var dataValidar  = document.frmAddCompra.txtData.value;
		var forneceValidar = document.frmAddCompra.txtFornecedor.value;
		//Para cada linha detalhe
		for (var i = 0; i < produtosValidar.length; i++) {
			//Cria a variável linha com valor de "i+1" para a mensagem avisar corretamente qual linha não foi preenchida
			var linha = i + 1;
			if (/*(produtosValidar[i].value=="")||*/(qtdeValidar[i].value == "") || (valorValidar[i].value == "") || (dataValidar == "") || (forneceValidar == "")) {
				//Avisa que não foi preenchida
				COLDIGO.exibirAviso("A linha " + linha + " não foi completamente preenchida");
				//Retorna falso, encerrando a função
				return false;
			}
		}
		//Se chegar aqui, esta tudo ok e return true
		return true;
	}




	/******************************** */
	//		Funções Compras
	/******************************** */


	COLDIGO.compra.cadastrar = function() {

		if (COLDIGO.compra.validaDetalhe()) {
			var compra = new Object();
			compra.data = document.frmAddCompra.txtData.value;
			compra.fornecedor = document.frmAddCompra.txtFornecedor.value;
			var produtos = document.getElementsByName("selProduto[]");
			var quantidades = document.getElementsByName("txtQuantidade[]");
			var valores = document.getElementsByName("txtValor[]");
			compra.produtos = new Array(produtos.length);
			for (var i = 0; i < produtos.length; i++) {
				compra.produtos[i] = new Object();
				compra.produtos[i].idProduto = 1;
				compra.produtos[i].quantidade = quantidades[i].value;
				compra.produtos[i].valor = valores[i].value;

			}
			console.log(compra);
			$.ajax({
				type: "POST",
				url: COLDIGO.PATH + "compra/inserir",
				data: JSON.stringify(compra),
				success: function(msg){
					COLDIGO.exibirAviso(msg);
				},
				error: function(info){
					COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: "+ info.status+ " - "+ info.statusText);
				}
			});


		}


	}



});