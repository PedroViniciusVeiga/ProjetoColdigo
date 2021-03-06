COLDIGO.relatorioCompra = new Object();

$(document).ready(function(){
	
	//busca no db e exibe a página os produtos que atendam a solicitação do user
	COLDIGO.relatorioCompra.buscar = function(){
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "compra/relatorio",
			success: function(dados){
				
				dados = JSON.parse(dados);
				$("#listaCompras").html(COLDIGO.relatorioCompra.exibir(dados));
				
				
			},
			error: function(info){
				COLDIGO.exibirAviso("Erro ao consultar as compras: "+info.status + " - " + info.statusText);
			}
			
		});
	};
	
	//Executa a função carregar a página
	COLDIGO.relatorioCompra.buscar();
	
	//Transforma os dados dos produtos recebidos do servidor em table html
	COLDIGO.relatorioCompra.exibir = function(listaDeCompras){
		
		//Criar uma variável pra receber o html das vendas
		var vendas = "";
		
		if(listaDeCompras!= undefined && listaDeCompras.length > 0){
			for(var i=0; i<listaDeCompras.length; i++){
				
				vendas += "<table>" + 
				"<tr>" + 
				"<th colspan='5'>Id:"+listaDeCompras[i].id+"</th>"+
				"</tr>" + 
				"<tr>" + 
				"<th>Data</th>"+
				"<td>"+listaDeCompras[i].data+"</td>"+
				"<th>Fornecedor</th>"+
				"<td colspan='2'>"+listaDeCompras[i].fornecedor+"</td>"+
				"</tr>";
				
				//Cria uma linha de titulo para os produtos
				vendas+= "<tr>" + 
				"<th>Categoria</th>"+
				"<th>Marca</th>"+
				"<th>Modelo</th>"+
				"<th>Quantidade</th>"+
				"<th>Valor</th>"+
				"</tr>"
				
				//Converte os dados em objeto JS
				//necessário devido a conversão realizada no backend em JDBCCompraDAO.relatorio
				listaDeCompras[i].produtos = JSON.parse(listaDeCompras[i].produtos)
				
				//Para cada produto
				for(var j=0; j<listaDeCompras[i].produtos.length; j++){
					
					//Cria uma linha com os dados
					vendas+="<tr>" +
					"<td>"+listaDeCompras[i].produtos[j].categoria+"</td>"+
				"<td>"+listaDeCompras[i].produtos[j].marca+"</td>"+
				"<td>"+listaDeCompras[i].produtos[j].modelo+"</td>"+
				"<td>"+listaDeCompras[i].produtos[j].quantidade+"</td>"+
				"<td>R$"+COLDIGO.formatarDinheiro(listaDeCompras[i].produtos[j].valor)+"</td>"+
				"</tr>"
				}
				
				
				//fecha a tabela
				 vendas+= "</table>";
			
			}
			//mas se não houver nenhuma compra
		}else if (listaDeCompras == ""){
			//Não foram encontrados registros
			vendas+="<h3>Nenhuma venda encontrada!</h3>";
		}
		//retorna a variavel com a table
		return vendas;
	};
	
	
	
	
	
});