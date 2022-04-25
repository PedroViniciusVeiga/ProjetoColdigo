COLDIGO.produto = new Object();

$(document).ready(function() {
	
	//Carrega as marcas registradas no BD no select do formulário de inserir ou editar
	COLDIGO.produto.carregarMarcas = function(id){
		if(id!=undefined){
			select = "#selMarcaEdicao";
		}else{
			select = "#selMarca";
		}
		
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marcas/buscar",
			success: function(marcas){
				

				if (marcas!="") {
					
					$(select).html("");
					var option = document.createElement("option");
					option.setAttribute ("value", "");
					option.innerHTML = ("Escolha");
					$(select).append(option);
				
					for (var i = 0; i < marcas.length; i++) {
						
						var option = document.createElement("option");
						option.setAttribute ("value", marcas[i].id);
						
						if ((id!=undefined)&&(id==marcas[i].id))
							option.setAttribute ("selected", "selected");
						
						option.innerHTML = (marcas[i].nome);
						$(select).append(option);
					}
					
				}else{
					
					$(select).html("");
					
					var option = document.createElement("option");
					option.setAttribute ("value", "");
					option.innerHTML = ("Cadastre uma marca primeiro!");
					$(select).append(option);
					$(select).addClass("aviso");
					
				}
			},
			error: function(info) {

				COLDIGO.exibirAviso("Erro ao buscar as marcas: "+ info.status + " - " + info.responseText);
				
				$(select).html("");
				var option = document.createElement("option");
				option.setAttribute("value", "");
				option.innerHTML = ("Erro ao carregar marcas!");
				$(select).append(option);
				$(select).addClass("aviso");
				
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
					
					COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: "+ info.status + " - " + info.responseText);
					
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
				COLDIGO.exibirAviso("Erro ao consultar os produtos: "+ info.status + " - " + info.responseText);
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
				"<a  onclick=\"COLDIGO.produto.exibirEdicao('"+listaDeProdutos[i].id+"')\"><img src='../../imgs/edit.png' alt='Editar Registro'></a> " +
				"<a onclick=\"COLDIGO.produto.confirmaExclusao('"+listaDeProdutos[i].id+"')\"><img src='../../imgs/delete.png' alt='Excluir Registro'></a> " +
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
				COLDIGO.exibirAviso("Erro ao excluir produto: "+ info.status + " - " + info.responseText);
			}
		});
	};
	
	//Carrega no BD os dados do produto selecionado para alteração e coloca-os no formulário de alteração
	COLDIGO.produto.exibirEdicao = function(id){
		$.ajax({
			type:"GET",
			url: COLDIGO.PATH + "produto/buscarPorId",
			data: "id="+id,
			success: function(produto){
		
				
				document.frmEditaProduto.idProduto.value = produto.id;
				document.frmEditaProduto.modelo.value = produto.modelo;
				document.frmEditaProduto.capacidade.value = produto.capacidade;
				document.frmEditaProduto.valor.value = produto.valor;

				
				var selCategoria = document.getElementById('selCategoriaEdicao');

				for(var i=0; i < selCategoria.length; i++){
					
					if (selCategoria.options[i].value == produto.categoria){

						selCategoria.options[i].setAttribute("selected", "selected");
					}else{

						selCategoria.options[i].removeAttribute("selected");
					}
				}
				
				COLDIGO.produto.carregarMarcas(produto.marcaId);
				
				var modalEditaProduto = {
						title: "Editar Produto",
						height: 400,
						width: 550,
						modal: true,
						buttons:{
							"Salvar": function(){
								COLDIGO.produto.editar();
								
							},
							"Cancelar": function(){
								$(this).dialog("close");
							}
						},
						close: function(){
							//caso o usuário simplismente feche a caixa de edição
							//não deve acontecer nada
						}
				};
				
				$("#modalEditaProduto").dialog(modalEditaProduto);
		
			},
			error: function(info){
				
				COLDIGO.exibirAviso("Erro ao buscar produtos para edição: "+ info.status + " - " + info.responseText);
			}
	});
	};
	
	//Realiza a edição dos dados no BD
	COLDIGO.produto.editar = function(){
		
		var produto = new Object();
		
		produto.id = document.frmEditaProduto.idProduto.value;
		produto.categoria = document.frmEditaProduto.categoria.value;
		produto.marcaId = document.frmEditaProduto.marcaId.value;
		produto.modelo = document.frmEditaProduto.modelo.value;
		produto.capacidade = document.frmEditaProduto.capacidade.value;
		produto.valor = document.frmEditaProduto.valor.value;
		//adicionado o produto já salvo e adicionando os dados
		
		$.ajax({
			type: "PUT",
			url: COLDIGO.PATH + "produto/alterar", 
			data: JSON.stringify(produto),
			success: function(msg){
				COLDIGO.exibirAviso(msg);
				COLDIGO.produto.buscar();
				$("#modalEditaProduto").dialog("close");
				//mensagem de aviso do sucesso atraves da modal
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao editar produto: "+ info.status + " - "+ info.responseText);
				
			}	
			});
	};
	
	COLDIGO.produto.confirmaExclusao = function(id){
	var modalExcluiProduto = {
			title: "Excluir Produtos",
			height: 250,
			width: 550,
			modal: true,
			buttons:{
				"Excluir": function(){
					COLDIGO.produto.excluir(id)
					$(this).dialog("close");
				},	
			"Cancelar": function(){
				$(this).dialog("close");
			
		}
			},
		close: function(){
			//caso o usuário simplismente feche a caixa de edição
			//não deve acontecer nada
		}
	};

$("#modalExcluiProduto").dialog(modalExcluiProduto);
};
	
});//Fim
