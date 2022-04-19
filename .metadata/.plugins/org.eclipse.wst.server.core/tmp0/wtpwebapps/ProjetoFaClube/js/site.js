function validaInscricao(){
	var nome = document.clubecoca.txtnome.value;// receber o valor do campo txtnome em uma variável
	var expRegNome = new RegExp("^[A-zÀ-ü]{3,}([ ]{1}[A-zÀ-ü]{2,})+$");//Criado um objeto RegExp e atribuido a variável expRegNome
	
if(!expRegNome.test(nome)){
	alert("Preencha o campo Nome corretamente. ");
		document.clubecoca.txtnome.focus();/*motivo de após o "ok" ir direto ao input do Nome, devido ao focus*/
		return false;/*impede o envio do formulário e de seguir a leitura dos códigos*/
	}

var cpf = document.clubecoca.txtcpf.value;// receber o valor do campo txtnome em uma variável
var expRegCpf = new RegExp("^[0-9]{3}[.]{1}[0-9]{3}[.]{1}[0-9]{3}[-]{1}[0-9]{2}$");//Criado um objeto RegExp e atribuido a variável expRegNome

if(!expRegCpf.test(cpf)){
alert("Preencha o campo do CPF corretamente. ");
	document.clubecoca.txtcpf.focus();/*motivo de após o "ok" ir direto ao input do Nome, devido ao focus*/
	return false;/*impede o envio do formulário e de seguir a leitura dos códigos*/
}

var fone  =  document.clubecoca.txtfone.value;
var expRegFone = new RegExp("^[(]{1}[1-9]{2}[)]{1}[0-9]{4,5}[-]{1}[0-9]{4}$");

if(!expRegFone.test(fone)){
	alert("Preencha o campo Telefone corretamente. ");
		document.clubecoca.txtfone.focus();
		return false;
	}

var email = document.clubecoca.txtemail.value;
var expRegEmail = new RegExp("^[A-zÀ-ü]{1,}[@]{1}[A-z]{2,}([.]{1}[A-z]{1,})+$");
if(!expRegEmail.test(email)){
	alert("Favor preencha o campo E-mail corretamente. ");
		document.clubecoca.txtemail.focus();
		return false;
	}
if(document.clubecoca.txtdata.value==""){
	alert("Favor selecione uma Data. ");
		document.clubecoca.txtdata.focus();
		return false;
	}

if(document.clubecoca.txtgenero.value==""){
	alert("Favor selecione uma das opções de Genêro. ");
	document.clubecoca.txtgenero[2].focus();
		return false;
	}


return true;/* Confirma que o formulário pode ser enviado*/
}

function verificaInscricao(){
	if(document.clubecoca.opcsim.checked==true){
		(document.getElementById("enviar").disabled=false);
	}else{
		(document.getElementById("enviar").disabled=true);
		}
	//verificar o conteudo do checkbox atraves do checked

}

//Assim que o documento HTML for carregado por completo...
$(document).ready(function(){
	//Carrega cabeçalho, menu e rodapé aos respectivos locais
	$("header").load("/ProjetoFaClube/pages/site/general/cabecalho.html");
	$("nav").load("/ProjetoFaClube/pages/site/general/menu.html");
	$("footer").load("/ProjetoFaClube/pages/site/general/rodape.html");
});
	







