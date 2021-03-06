package br.com.coldigogeladeiras.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.modelo.ProdutoCompra;

public class JDBCProdutoCompraDAO {
	
	private Connection conexao;
	
	public JDBCProdutoCompraDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public boolean inserir(ProdutoCompra produtoCompra) throws SQLException{
	
	String comando = "insert into compras_has_produtos "
			+ "(compras_id, produtos_id, valor, quantidade) VALUES (?,?,?,?)";
	PreparedStatement p;
	
	p=this.conexao.prepareStatement(comando);
	p.setInt(1, produtoCompra.getIdCompra());
	p.setInt(2, produtoCompra.getIdProduto());
	p.setFloat(3, produtoCompra.getValor());
	p.setInt(4, produtoCompra.getQuantidade());
	p.execute();

	return true;
	}

	
	
	public List<JsonObject> buscaPorCompra(int idCompra){
		List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
		JsonObject produto = null;
		
		String comando = "select produtos.categoria, marcas.nome as marca, produtos.modelo, compras_has_produtos.valor, compras_has_produtos.quantidade from bdcoldigo.compras_has_produtos Inner join produtos on produtos.id=compras_has_produtos.produtos_id inner join marcas on marcas.id=produtos.marcas_id where compras_id = '"+idCompra+"'";
		try {
			
			Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while (rs.next()){
				String categoria = rs.getString("categoria");
				String marca = rs.getString("marca");
				String modelo = rs.getString("modelo");
				float valor = rs.getFloat("valor");
				int quantidade = rs.getInt("quantidade");
				
				if(categoria.equals("1")) {
					categoria = "Geladeira";
				}else if (categoria.equals("2")) {
					categoria = "Freezer";
				}
				
				produto = new JsonObject();
				produto.addProperty("categoria", categoria);
				produto.addProperty("marca" , marca);
				produto.addProperty("modelo", modelo);
				produto.addProperty("valor", valor);
				produto.addProperty("quantidade" , quantidade);
				
				listaProdutos.add(produto);
				
			}
			
			
		}catch (SQLException e) {
		e.printStackTrace();
		
		}
		return listaProdutos;
	}
	
	}//end

