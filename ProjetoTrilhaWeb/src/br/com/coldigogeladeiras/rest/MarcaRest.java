package br.com.coldigogeladeiras.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.bd.Conexao;
import br.com.coldigogeladeiras.jdbc.JDBCMarcaDAO;
import br.com.coldigogeladeiras.modelo.Marca;



@Path("marcas")
public class MarcaRest extends UtilRest{

	@GET
	@Path("/buscar")
	@Produces(MediaType.APPLICATION_JSON)//produzir conteúdos em JSON
	public Response buscar() {
		
		try {
		List<Marca> listaMarcas = new ArrayList<Marca>();
	
		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao);
		listaMarcas = jdbcMarca.buscar();
		conec.fecharConexao();
		return this.buildResponse(listaMarcas);
	
		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String marcaParam) {
		
		try {
			
			
			
			Marca marca = new Gson().fromJson(marcaParam, Marca.class);
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao);
			boolean retornoMarca = jdbcMarca.validaMarca(marca.getNome());
			String msg = "";
			if(retornoMarca == false) {
			boolean retorno = jdbcMarca.inserir(marca);
			conec.fecharConexao();
			
			if(retorno) {
				msg = "Marca cadastrada com sucesso!";
			}else {
				msg = "Erro ao cadastrar marca.";
				return this.buildErrorResponse(msg);
			}		
			}else {
				msg = "Há uma marca cadastrada com este nome, altere e tente novamente!";
			}
			return this.buildResponse(msg);

		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}
	
	@GET
	@Path("/buscarMarcas")///ProjetoTrilhaRest/rest/produto/buscar este é o caminho por estar comentado após o rest/ o produto e agora a requisição d busca
	@Consumes("application/*")//Consome o resultado da busca
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorNome(@QueryParam("valorBusca") String nomeMarca) {
		
		try {
			
			List<JsonObject> listaMarcas = new ArrayList<JsonObject>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao); 
			listaMarcas = jdbcMarca.buscarPorNome(nomeMarca);
			System.out.println(listaMarcas);
			conec.fecharConexao();
		
			String json = new Gson().toJson(listaMarcas);
			return this.buildResponse(json);
			
		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
	
	@DELETE
	@Path("/excluir/{id}")
	@Consumes("application/*")
	public Response excluir (@PathParam("id") int id){ //utilizar atributo sendo o seu proprio valor
		
		try {
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao); 

			boolean retornoMarcas = jdbcMarca.verificaMarca(id);
			boolean retornoVerificar = jdbcMarca.verificaMarcaNoProduto(id);//verifica se há produtos com a marca em questão
			boolean retornoDeletar = jdbcMarca.deletar(id);//exclui a marca em questão
			conec.fecharConexao();
			String msg = "";
			if(retornoMarcas == false) {
				msg = "Esta marca não foi encontrada, carregue a página e tente novamente! ";
			}else if(retornoVerificar == true) {
				msg = "Há um produto cadastrado com essa marca, carregue a página e tente novamente! ";
				return this.buildErrorResponse(msg);
			}else if(retornoDeletar == true){
				msg = "Marca excluída com sucesso!";
				
			}	
				
			
			
			return this.buildResponse(msg);
			
		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
	
	@GET
	@Path("/buscarPorId")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id) { //utilizar atributo na url
		
		try {
			Marca marca = new Marca();// cria um novo produto para sobrepor o antigo
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao); 
			
			marca = jdbcMarca.buscarPorId(id);
			
			conec.fecharConexao();
			
			return this.buildResponse(marca);
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
		
	}
	
	@PUT
	@Path("/alterar")
	@Consumes("application/*")
	public Response alterar(String marcaParam) {
		
		try {
			Marca marca = new Gson().fromJson(marcaParam,  Marca.class);
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao); 
			String msg = "";
			boolean nomeInalterado = jdbcMarca.validaInalteracao(marca);

			if(nomeInalterado == true) { //verifica se nada foi alterado
				msg = "Nenhuma alteração foi realizada!";
				return this.buildResponse(msg);


			}else {
			boolean retornoMarca = jdbcMarca.validaMarca(marca.getNome());
			if(retornoMarca == false) {// verifica duplicada
			boolean retorno = jdbcMarca.alterar(marca);
			conec.fecharConexao();
	
			if (retorno) {
				msg = "Marca alterada com sucesso!";
			}else {
				msg = "Erro ao alterar marca.";
				return this.buildErrorResponse(msg);
			}
			}else{
				msg = "Há uma marca cadastrada com este nome, altere e tente novamente!";
				
			}
			
			}
			return this.buildResponse(msg);
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
	
	
	@PUT
	@Path("/ativaMarca/{id}")
	@Consumes("application/*")
	public Response ativaMarca(@PathParam("id") int id) {
		
		try {
			
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao); 
		
			Marca marca = jdbcMarca.buscarPorId(id);
			boolean retorno = jdbcMarca.ativaMarca(marca);
			conec.fecharConexao();
			String msg = "";
			if (retorno) {
				if(marca.getStatus() == 1) {
					msg = "Marca ativada!";
				}else{
					msg = "Marca desativada!";	
					
					}
			}else {
				msg = "Erro ao alterar status.";
				return this.buildErrorResponse(msg);
			}
			
			
			return this.buildResponse(msg);
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
}// fim
