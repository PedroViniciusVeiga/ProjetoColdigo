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
		//	COLDIGO.marcas.buscar();
				},
				error: function(info) {
					COLDIGO.exibirAviso("Erro ao cadastrar uma nova marca: "+ info.status + " - " + info.statusText);
					
				}
			});
		}
		
		
		 
	}
	
});//Fim