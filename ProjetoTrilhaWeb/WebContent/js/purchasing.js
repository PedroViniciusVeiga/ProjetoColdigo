COLDIGO.compra = new Object();

$(document).ready(function(){
	
/*********************************
	Funções do Mestre Detalhe
*********************************/

/* Função para CRIAR uma nova linha no detalhe do form*/

//Ao clicar no botão add
$(".botaoAdd").click(function(){
	
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
		if($("tr.detalhes").length > 1){
			//remove a linha que contem o botão
			//o segundo parent é a linha onde esta o botão
			
			$(botao).parent().parent().remove();
			//senão é porque só tem uma linha
		}else{
			//avisa que não pode remover
			COLDIGO.exibirAviso("A última linha não pode ser removida")
		}
		
	}


	
});