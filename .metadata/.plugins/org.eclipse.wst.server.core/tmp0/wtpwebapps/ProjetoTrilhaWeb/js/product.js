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
			COLDIGO.produto.buscar();
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
				
				
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao consultar os contatos: "+ info.status + " - " + info.statusText);
			}
		});
		
	};
	
	//Transforma os dados dos produtos recebidos do servidor em uma tabela HTML
	COLDIGO.produto.exibir = function(listaDeProdutos) {
		
		var tabela = "<table>" +
				"<tr>" +
				"<th>Categoria</th>" +
				"<th>Marca</th>" +
				"<th>Modelo</th>" +
				"<th>Cap.(l)</th>" +
				"<th>Valor</th>" +
				"<th class='acoes'>Ações</th>" +
				"</tr>";
		
		if (listaDeProdutos != undefined && listaDeProdutos.length > 0){
			
			for (var i=0; i<listaDeProdutos.length; i++){
				tabela += "<tr>" +
				"<td>"+listaDeProdutos[i].categoria+"</td>" +
				"<td>"+listaDeProdutos[i].marcaNome+"</td>" +
				"<td>"+listaDeProdutos[i].modelo+"</td>" +
				"<td>"+listaDeProdutos[i].capacidade+"</td>" +
				"<td>R$	"+COLDIGO.formatarDinheiro(listaDeProdutos[i].valor)+"</td>" +
				"<td>" +
				"<a><img src='../../imgs/edit.png' alt='Editar Registro'></a> " +
				"<a onclick=\"COLDIGO.produto.excluir('"+listaDeProdutos[i].id+"')\"><img src='../../imgs/delete.png' alt='Excluir Registro'></a> " +
				"</td>" +
				"</tr>"

			}
			
			
			
			
		} else if (listaDeProdutos == ""){
			tabela += "<tr><td colspan='6'>Nenhum registro encontrado</td></tr>";
		}
		tabela += "</table>";
		
		return tabela;
		
	};
	
	//Executa a função de busca ao carregar a página
	COLDIGO.produto.buscar();
	
	
	//Exclui o produto selecionado
	COLDIGO.produto.excluir = function(id){
		$.ajax({
			type:"DELETE",
			url: COLDIGO.PATH + "produto/excluir/"+id,
			success: function(msg){
				COLDIGO.exibirAviso(msg);
				COLDIGO.produto.buscar();
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao excluir produto: "+ info.status + " - " + info.statusText);
			}
		});
	};	
});
