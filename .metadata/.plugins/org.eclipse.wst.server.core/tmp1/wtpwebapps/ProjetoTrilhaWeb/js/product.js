COLDIGO.produto = new Object();

$(document).ready(function() {
	
	//Carrega as marcas registradas no BD no select do formulário de inserir
	COLDIGO.produto.carregarMarcas = function(){
		alert("Tentando buscar marcas");
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marca/buscar",
			success: function(marcas){
				

				if (marcas!="") {
					
					$("#selMarca").html("");
					var option = document.createElement("option");
					option.setAttribute ("value", "");
					option.innerHTML = ("Escolha");
					$("#selMarca").append(option);
				
					for (var i = 0; i < marcas.length; i++) {
						
						var option = document.createElement("option");
						option.setAttribute ("value", marcas[i].id);
						option.innerHTML = (marcas[i].nome);
						$("#selMarca").append(option);
					}
					
				}else{
					
					$("#selMarca").html("");
					
					var option = document.createElement("option");
					option.setAttribute ("value", "");
					option.innerHTML = ("Cadastre uma marca primeiro!");
					$("#selMarca").append(option);
					$("#selMarca").addClass("aviso");
					
				}
			},
			error: function(info) {

				COLDIGO.exibirAviso("Erro ao buscar as marcas: "+ info.status + " - " + info.statusText);
				
				$("#selMarca").html("");
				var option = document.createElement("option");
				option.setAttribute("value", "");
				option.innerHTML = ("Erro ao carregar marcas!");
				$("#selMarca").append(option);
				$("#selMarca").addClass("aviso");
				
			}
				
		});
		
	}
	
	COLDIGO.produto.carregarMarcas();
	
	//Cadastra no BD o produto informado
	COLDIGO.produto.cadastrar = function(){
		
		var produto = new Object();
		produto.categoria = document.frmAddProduto.categoria.value;
		produto.marcaId = document.frmAddProduto.marcaId.value;
		produto.modelo = document.frmAddProduto.modelo.value;
		var expRegModelo = new RegExp("^[A-zÀ-ü]{3,}$");
		produto.capacidade = document.frmAddProduto.capacidade.value;
		var expRegCapacidade = new RegExp("^[0-9]{1,}$");
		produto.valor = document.frmAddProduto.valor.value;
		var expRegValor = new RegExp("^[0-9]{1,}[,]{1}[0-9]{2}$");
		
		
		if ((produto.categoria=="")||(produto.marcaId=="")||(!expRegModelo.test(produto.modelo))||(!expRegCapacidade.test(produto.capacidade))||(!expRegValor.test(produto.valor))){
		COLDIGO.exibirAviso("Preencha todos os campos!");
		
		} else {
			var valorCorreto = produto.valor.replace(",", ".");
			produto.valor = valorCorreto;
			$.ajax({
				type: "POST", //requisição, utilizado desta forma por se tratar de um formulário, e as informações não poderem ser visiveis
				url: COLDIGO.PATH + "produto/inserir",
				data:JSON.stringify(produto), //transformar o objeto produto em String, transoformado em texto para ser enviado formatado
				success: function (msg) {
			COLDIGO.exibirAviso(msg);
			$("#addProduto").trigger("reset"); //para limpar o form após aceitar o cadastro
				},
				error: function(info) {
					COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: "+ info.status + " - " + info.statusText);
					
				}
			});
		}
	}
	
	//Busca no BD e exibe na página os produtos que atendam à solicitação do usuário
	COLDIGO.produto.buscar = function(){
		
		var valorBusca = $("#campoBuscaProduto").val();//valor digitado no filtro
		
		$.ajax({
			type: "GET",//usado o GET por ser uma busca de informações
			url: COLDIGO.PATH + "produto/buscar",
			data: "valorBusca="+valorBusca,
			success: function(dados){
				
				dados = JSON.parse(dados);
				$("#listaProdutos").html(COLDIGO.produto.exibir(dados));
				console.log(dados);
				
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao consultar os contatos: "+ info.status + " - " + info.statusText);
			}
		});
		
	};
	
	//Executa a função de busca ao carregar a página
	COLDIGO.produto.buscar();
	
});
