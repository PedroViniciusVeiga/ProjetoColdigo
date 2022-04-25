COLDIGO.marcas = new Object();

$(document).ready(function() {


//Cadastrar Marcas
	COLDIGO.marcas.cadastrar = function(){
		
		var marca = new Object();
		marca.nome = document.frmAddMarcas.nome.value;
		var expRegNome = new RegExp("^[A-zÀ-ü]{1,}$");
		
		if (!expRegNome.test(marca.nome)){
			COLDIGO.exibirAviso("Informação inválida, preencha o campo corretamente!");
			
		}else{
			
			$.ajax({
				type: "POST", //requisição, utilizado desta forma por se tratar de um formulário, e as informações não poderem ser visiveis
				url: COLDIGO.PATH + "marcas/inserir",
				data:JSON.stringify(marca), //transformar o objeto produto em String, transoformado em texto para ser enviado formatado
				success: function (msg) {
			COLDIGO.exibirAviso(msg);
			$("#addMarca").trigger("reset"); //para limpar o form após aceitar o cadastro
		   COLDIGO.marcas.buscar();
				},
				error: function(info) {
					COLDIGO.exibirAviso("Erro ao cadastrar uma nova marca: "+ info.status + " - " + info.responseText);
					
				}
			});
		}	 
	}
	
	//Busca no BD e exibe na página os produtos que atendam à solicitação do usuário
	COLDIGO.marcas.buscar = function(){
		
		var valorBusca = $("#campoBuscaMarcas").val();//valor digitado no filtro
		
		$.ajax({
			type: "GET",//usado o GET por ser uma busca de informações
			url: COLDIGO.PATH + "marcas/buscarMarcas",
			data: "valorBusca="+valorBusca,
			success: function(dados){
				console.log(dados);
				dados = JSON.parse(dados);
				$("#listaMarcas").html(COLDIGO.marcas.exibir(dados));
				
				
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao consultar as marcas: "+ info.status + " - " + info.responseText);
			}
		});
	};
	
	//Transforma os dados dos produtos recebidos do servidor em uma tabela HTML
	COLDIGO.marcas.exibir = function(listaDeMarcas) {
		var tabela = "<table>" +
				"<tr>" +
				"<th>Nome</th>" +
				"<th class='acoes'>Ações</th>" +
				"<th class='acoes'>Status</th>" +
				"</tr>";
		
		if (listaDeMarcas != undefined && listaDeMarcas.length > 0){
			
			for (var i=0; i<listaDeMarcas.length; i++){
				
				var statusValor = "";
				if(listaDeMarcas[i].status == 1){
					statusValor = "checked";
				}
				
				tabela += "<tr>" +
				"<td>"+listaDeMarcas[i].nome+"</td>" +
				"<td>" +
				"<a  onclick=\"COLDIGO.marcas.exibirEdicao('"+listaDeMarcas[i].id+"')\"><img src='../../imgs/edit.png' alt='Editar Registro'></a> " +
				"<a onclick=\"COLDIGO.marcas.confirmaExclusao('"+listaDeMarcas[i].id+"')\"><img src='../../imgs/delete.png' alt='Excluir Registro'></a> " +
				"</td>" +
				"<td>"+
				"<label onclick=\"COLDIGO.marcas.ativaMarca('"+listaDeMarcas[i].id+"',this)\"class='switch'><input name= 'statusMarca' type='checkbox' "+statusValor+"><span class='slider round'></span></label></td>"+
				"</tr>"

			}
				
		} else if (listaDeMarcas == ""){
			tabela += "<tr><td colspan='3'>Nenhum registro encontrado</td></tr>";
		}
		tabela += "</table>";
		
		return tabela;
		
	};
	
	//Executa a função de busca ao carregar a página
	COLDIGO.marcas.buscar();
	 
	//Exclui o produto selecionado
	COLDIGO.marcas.excluir = function(id){
		$.ajax({
			type:"DELETE",
			url: COLDIGO.PATH + "marcas/excluir/"+id,
			success: function(msg){
				//Verificação pode ficar aqui
				COLDIGO.exibirAviso(msg);
				COLDIGO.marcas.buscar();
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao excluir marca: "+ info.status + " - " + info.responseText);
			}
		});
	};
	
	//Carrega no BD os dados do produto selecionado para alteração e coloca-os no formulário de alteração
	COLDIGO.marcas.exibirEdicao = function(id){
		$.ajax({
			type:"GET",
			url: COLDIGO.PATH + "marcas/buscarPorId",
			data: "id="+id,
			success: function(marca){
				
			document.frmEditaMarcas.marcaId.value = marca.id;
			document.frmEditaMarcas.nome.value = marca.nome;
	
		
				
				var modalEditaMarcas = {
						title: "Editar Marcas",
						height: 400,
						width: 550,
						modal: true,
						buttons:{
							"Salvar": function(){
								COLDIGO.marcas.editar();
								
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
				
				$("#modalEditaMarcas").dialog(modalEditaMarcas);
		
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao buscar marcas para edição: "+ info.status + " - " + info.responseText);
			}
	});
	};
	
	//Realiza a edição dos dados no BD
	COLDIGO.marcas.editar = function(){
		
		var marcas = new Object();
		
		marcas.id = document.frmEditaMarcas.marcaId.value;
		marcas.nome = document.frmEditaMarcas.nome.value;
		
		//adicionado o produto já salvo e adicionando os dados
		
		$.ajax({
			type: "PUT",
			url: COLDIGO.PATH + "marcas/alterar", 
			data: JSON.stringify(marcas),
			success: function(msg){
				COLDIGO.exibirAviso(msg);
				COLDIGO.marcas.buscar();
				$("#modalEditaMarcas").dialog("close");
				//mensagem de aviso do sucesso atraves da modal
			},
			error: function(info){
				
				COLDIGO.exibirAviso("Erro ao editar marca: "+ info.status + " - "+ info.responseText);
				
			}	
			});
	};
	
	COLDIGO.marcas.confirmaExclusao = function(id){
		var modalExcluiMarcas = {
				title: "Excluir Marcas",
				height: 250,
				width: 550,
				modal: true,
				buttons:{
					"Excluir": function(){
						COLDIGO.marcas.excluir(id)
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

	$("#modalExcluiMarcas").dialog(modalExcluiMarcas);
	};

	COLDIGO.marcas.ativaMarca = function(id,checkbox){

		$.ajax({
			type: "PUT",
			url: COLDIGO.PATH + "marcas/ativaMarca/"+id, 
			success: function(msg){
				COLDIGO.exibirAviso(msg);
			},
			error: function(info){
				checkbox.checked=!checkbox.checked;
				COLDIGO.exibirAviso("Erro ao alterar status da marca: "+ info.status + " - "+ info.responseText);
			}	
			});

		
	}
	
});//Fim