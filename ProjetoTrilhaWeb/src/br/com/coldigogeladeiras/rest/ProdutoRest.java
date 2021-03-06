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
import javax.ws.rs.Produces;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.bd.Conexao;
import br.com.coldigogeladeiras.jdbc.JDBCProdutoDAO;
import br.com.coldigogeladeiras.modelo.Produto;

@Path("produto")
public class ProdutoRest extends UtilRest{
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String produtoParam) {
		
		try {
			
			
			
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			boolean retornoProdutos = jdbcProduto.validaProduto(produto);
			String msg = "";
			if(retornoProdutos == false) {		
			boolean retornoMarcas = jdbcProduto.verificaExistenciaMarca(produto.getMarcaId());
			boolean retorno = jdbcProduto.inserir(produto);
			conec.fecharConexao();
			
			if (retornoMarcas == true) {
			
			if (retorno){
				msg = "Produto cadastrado com sucesso!";
			}
			}else if (retornoMarcas == false){
				msg = "A marca selecionada não existe, atualize a página e tente novamente!";
				return this.buildErrorResponse(msg);

			}
			}else {
				msg = "Há um produto cadastrado com esse nome, altere e tente novamente";

			}
			return this.buildResponse(msg);
		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}

	@GET
	@Path("/buscar")///ProjetoTrilhaRest/rest/produto/buscar este é o caminho por estar comentado após o rest/ o produto e agora a requisição d busca
	@Consumes("application/*")//Consome o resultado da busca
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorNome(@QueryParam("valorBusca") String nome) {
		
		try {
			
			List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao); 
			listaProdutos = jdbcProduto.buscarPorNome(nome);
			conec.fecharConexao();
		
			String json = new Gson().toJson(listaProdutos);
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
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao); 
			
			boolean retorno = jdbcProduto.deletar(id);
			conec.fecharConexao();
			String msg = "";
			if(retorno) {
				msg = "Produto excluído com sucesso!";
			}else {
				msg = "Erro ao excluir produto. ";
				return this.buildErrorResponse(msg);
			}
			
			
			
			return this.buildResponse(msg);
			
		}catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
	
	@GET
	@Path("/buscarPorId")//com a modal na hora de salvar
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id) { //utilizar atributo na url
		
		try {
			Produto produto = new Produto();// cria um novo produto para sobrepor o antigo
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			
			
			boolean retornoProd = jdbcProduto.verificaExistenciaProd(id);
			produto = jdbcProduto.buscarPorId(id);
			conec.fecharConexao();
			String msg= "";
			if(retornoProd == true) {
			
			}else if (retornoProd == false) {
				msg ="O produto selecionado não existe, carregue a página e selecione novamente!";
				return this.buildErrorResponse(msg);

			}

			return this.buildResponse(produto);
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
		
	}
	
	@PUT
	@Path("/alterar")//após salvar
	@Consumes("application/*")
	public Response alterar(String produtoParam) {
		System.out.println(produtoParam);
		try {
			Produto produto = new Gson().fromJson(produtoParam,  Produto.class);
			//conversão do json recebido em um objeto da classe Produto
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			
			boolean retornoDuplicada = jdbcProduto.validaInalteracao(produto);
			boolean retornoMarcas = jdbcProduto.verificaExistenciaMarca(produto.getMarcaId());
			boolean retornoProd = jdbcProduto.verificaExistenciaProd(produto.getId());
			
			
			String msg = "";

			if(retornoDuplicada == false) {//valida duplicadas
			
			if(retornoProd == true) {
				if(retornoMarcas == true) {
					boolean retorno = jdbcProduto.alterar(produto);
					
			if (retorno){
				msg = "Produto alterado com sucesso!";
			}
				}else if (retornoMarcas == false) {
					
					msg = "Alteração não efetuada, a marca selecionada não existe!";
					return this.buildErrorResponse(msg);

				}
				
			}else {
				msg = "Alteração não efetuada, o produto selecionado não existe!";
				return this.buildErrorResponse(msg);

			}
			}else {
				msg = "Há um produto cadastrado com esse nome, altere e tente novamente";

			}
			
			conec.fecharConexao();
			
			return this.buildResponse(msg);
		}catch (Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
	}
	
	
}


