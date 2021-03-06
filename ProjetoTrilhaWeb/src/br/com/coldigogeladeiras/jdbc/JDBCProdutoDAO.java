package br.com.coldigogeladeiras.jdbc;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.jdbcinterface.ProdutoDAO;
import br.com.coldigogeladeiras.modelo.Produto;

public class JDBCProdutoDAO implements ProdutoDAO{
	
	private Connection conexao;
	
	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public boolean inserir(Produto produto) {
		
		String comando = "INSERT INTO produtos (id, categoria, modelo, capacidade, valor, marcas_id) VALUES (?,?,?,?,?,?)";
		PreparedStatement p;
		
		try {
			
			//Prepara o comando para a execução no BD em que nos conectamos
			p = this.conexao.prepareStatement(comando);
			
			//Substitui no comando os "?" pelos respectivos valores do produto
			p.setInt(1, produto.getId());
			p.setString (2, produto.getCategoria());
			p.setString (3, produto.getModelo());
			p.setInt (4, produto.getCapacidade());
			p.setFloat (5, produto.getValor());
			p.setInt (6, produto.getMarcaId());


			//Executa o comando no BD 
			p.execute();

		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public List<JsonObject> buscarPorNome(String nome) {
		
	
	//inicia a criação do comando SQL de busca
	String comando = "SELECT produtos.*, marcas.nome as marca FROM produtos " + ""
			+ "INNER JOIN marcas ON produtos.marcas_id = marcas.id ";
	//Se o nome não estiver vazio...
	if (!nome.equals("")) {
		//concatena no comando where buscando no nome do produto
		//o texto da variável nome
		comando += "WHERE modelo LIKE '%" + nome + "%' ";	
	}
	
	//Finaliza o comando ordenando alfabeticamente por
	//categoria, marca e depois modelo
	comando += "ORDER BY categoria ASC, marcas.nome ASC, modelo ASC";
	
	List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
	JsonObject produto = null;
	
	
	try {
		
		Statement stmt = conexao.createStatement();
		ResultSet rs = stmt.executeQuery(comando);
		
		while (rs.next()) {//abaixo é o que será feito em cada linha que virá do BD
			
			int id = rs.getInt("id");
			String categoria = rs.getString("categoria");
			String modelo = rs.getString("modelo");
			int capacidade = rs.getInt("capacidade");
			float valor = rs.getFloat("valor");
			String marcaNome = rs.getString("marca");
			
			if (categoria.equals("1")) {
				categoria = "Geladeira";
			}else if (categoria.equals("2")) {
				categoria = "Freezer";
			}
			

			produto = new JsonObject();//criar códigos no formato JSON, mas como um objeto Java.
			produto.addProperty("id", id);
			produto.addProperty("categoria", categoria);
			produto.addProperty("modelo", modelo);
			produto.addProperty("capacidade", capacidade);
			produto.addProperty("valor", valor);
			produto.addProperty("marcaNome", marcaNome);
			
			listaProdutos.add(produto);
			
		}
		
		
	}catch (Exception e) {
		e.printStackTrace();
	}
			
			return listaProdutos;
			
			
	}

	public boolean deletar(int id) {
		String comando = "DELETE FROM produtos WHERE id = ?";
		PreparedStatement p;
		try {
			p= this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			p.execute();
		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;

	}
	
	public Produto buscarPorId(int id) {
		String comando = "SELECT *FROM produtos WHERE produtos.id = ?";
		Produto produto = new Produto();
		try {
			PreparedStatement p = this.conexao.prepareStatement(comando); //Preparar o comando
			p.setInt(1, id);
			ResultSet rs = p.executeQuery();
			while (rs.next()) {
				
				String categoria = rs.getString("categoria");
				String modelo = rs.getString("modelo");
				int capacidade = rs.getInt("capacidade");
				float valor = rs.getFloat("valor"); 
				int marcaId = rs.getInt("marcas_id");
				
				produto.setId(id);
				
				produto.setCategoria(categoria);
				produto.setMarcaId(marcaId);
				produto.setModelo(modelo);
				produto.setCapacidade(capacidade);
				produto.setValor(valor);
				

			}
		}catch (SQLException e) {
			e.printStackTrace();
		
		}
		return produto;
	}
	
	public boolean alterar(Produto produto) {
		
		String comando = "UPDATE produtos " +"SET categoria=?, modelo=?, capacidade=?, valor=?, marcas_id=?"
		+ " WHERE id=?";
// O id é pego através do proprio html quando clicamos na opção do produto especifico
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getCategoria());
			p.setString(2, produto.getModelo());
			p.setInt(3, produto.getCapacidade());
			p.setFloat(4, produto.getValor());
			p.setInt(5, produto.getMarcaId());
			p.setInt(6, produto.getId());
			p.executeUpdate();

			//setado os valores alterados no produto
			
		
		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
		
	}
	
	public boolean verificaExistenciaMarca(int id) {

		
		String comando = "SELECT * FROM marcas WHERE marcas.id = " + id;
		try {
System.out.println(id);
			PreparedStatement p = this.conexao.prepareStatement(comando); // Preparar o comando
			ResultSet rs = p.executeQuery();

			while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
				
				
				return true;// Se a marca existir no bd pode deletar
			}
			return false;// Marca não existe no bd não pode deletar
		} catch (SQLException e) {
			e.printStackTrace();
		return false;
	}
	
	
	}
	
public boolean verificaExistenciaProd(int id) {

		
		String comando = "SELECT * FROM produtos WHERE produtos.id = " + id;
		try {
			System.out.println(id);
			PreparedStatement p = this.conexao.prepareStatement(comando); // Preparar o comando
			ResultSet rs = p.executeQuery();

			while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
				
				
				return true;// Se a marca existir no bd pode deletar
			}
			return false;// Marca não existe no bd não pode deletar
		} catch (SQLException e) {
			e.printStackTrace();
		return false;
	}
	
	
	}

public boolean verificaMarca(int id) {

	
	String comando = "SELECT * FROM marcas WHERE marcas.id = " + id;
	try {

		PreparedStatement p = this.conexao.prepareStatement(comando); // Preparar o comando
		ResultSet rs = p.executeQuery();

		while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
			
			
			return true;// Se a marca existir no bd pode deletar
		}
		return false;// Marca não existe no bd não pode deletar
	} catch (SQLException e) {
		e.printStackTrace();
	return false;
}


}

public boolean validaProduto(Produto produto) {
	String comando = "SELECT * FROM produtos WHERE produtos.modelo = ? AND produtos.categoria = ?";
	try {
		
		PreparedStatement p = this.conexao.prepareStatement(comando);
		p.setString(1,produto.getModelo());
		p.setString(2,produto.getCategoria());
		ResultSet rs = p.executeQuery();
		while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
			
			
			return true;// Se a marca existir no bd pode deletar
		}
		return false;// Marca não existe no bd não pode deletar
	} catch (SQLException e) {
		e.printStackTrace();
	return false;
}


}

public boolean validaInalteracao(Produto produto) {
	String comando = "SELECT * FROM produtos WHERE produtos.modelo = ? AND produtos.categoria = ? AND produtos.id != ?";
	try {
		
		PreparedStatement p = this.conexao.prepareStatement(comando);
		p.setString(1,produto.getModelo());
		p.setString(2,produto.getCategoria());
		p.setInt(3, produto.getId());
		ResultSet rs = p.executeQuery();
		while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
			
			
			return true;// Se a marca existir no bd pode deletar
		}
		return false;// Marca não existe no bd não pode deletar
	} catch (SQLException e) {
		e.printStackTrace();
	return false;
}


}


}// fim
