//Cria objeto COLDIGO, que será usado como identificador do objeto
COLDIGO = new Object();


$(document).ready(function(){
	
	//Cria uma constante com o valor da URI raiz do REST
	COLDIGO.PATH = "/ProjetoTrilhaWeb/rest/";

	$("header").load("/ProjetoTrilhaWeb/pages/admin/general/header.html");
	$("footer").load("/ProjetoTrilhaWeb/pages/admin/general/footer.html");

	//função para carregamento de páginas de conteúdo, que
	// recebe como parâmetro o nome da pasta com a página a ser carregada
	COLDIGO.carregaPagina = function(pagename){
		

		
		
		//limpa a tag section, excluindo todo o conteúdo dentro dela
		$("section").empty();
		//Carrega a página solicitada dentro da tag section
		$("section").load(pagename+"/", function(response, status, info)/*Não precisa do nome, pois o arquivo é o index*/ {
			if(status == "error") {
				var msg = "Houve um erro ao encontrar a página: "+ info.status + " - " + info.statusText;
				$("section").html(msg);
				
			}
			});
		}
		
	//Define as configurações base de um modal de aviso
	COLDIGO.exibirAviso = function(aviso){
		var modal = {
				title: "Mensagem",
				height: 250,
				width: 400,
				modal: true,
				buttons: {
					"OK": function(){
						$(this).dialog("close");
					}
				}
		};
		$("#modalAviso").html(aviso);
		$("#modalAviso").dialog(modal);
	}
	//Exibe os valores financeiros no formato da moeda real
	COLDIGO.formatarDinheiro = function(valor){
		return valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
	}
});