package br.com.coldigogeladeiras.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.jdbcinterface.MarcaDAO;
import br.com.coldigogeladeiras.modelo.Marca;


public class JDBCMarcaDAO implements MarcaDAO{
	
	private Connection conexao;
	
	public JDBCMarcaDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public List<Marca> buscar(){
		
		//Criação da instrução SQL para busca de todas as marcas
		String comando = "SELECT * FROM marcas where marcas.status = 1";
		
		//Criação de uma lista para armazenar
		List<Marca> listMarcas = new ArrayList<Marca>();
		
		//Criação do objeto marca com valor null(ou seja, sem instanciá-lo)
		Marca marcas = null;
		
		//Abertura do try-catch
		try {
			
			//Uso da conexão do banco para prepará-lo para uma instrução SQL
			Statement stmt = conexao.createStatement();			
			
			//Execução da instrução criada previamente
			//e armazenamento do resultado do objeto rs
			ResultSet rs = stmt.executeQuery(comando);
			
			//Enquanto houver uma proxima linha no resultado
			while (rs.next()) {
				
				//Criação de instância da classe Marca
				marcas = new Marca();
				
				//Recebimento dos 2 dados retornados do BD para cada linha encontrada
				int id = rs.getInt("id");
				String nome = rs.getString("nome");
				
				//Setando no objeto marca os valores encontrados
				marcas.setId(id);
				marcas.setNome(nome);
				
				//Adição da instância contida no objeto Marca na lista de marcas
				listMarcas.add(marcas);
			}

			
			//Caso alguma Exception seja gerada no try, recebe-a no objeto "ex"
		}catch (Exception ex) {
			//Exibe a exceção na console
			ex.printStackTrace();
		}

		//Retorna para quem chamou o método a lista criada
		return listMarcas;
	
	}
	
	public boolean inserir(Marca marca) {
		
		String comando = "INSERT INTO marcas (id, nome) VALUES (?,?)";
		PreparedStatement p;
		
		try {
			
			//Prepara o comando para a execução no BD em que nos conectamos
			p = this.conexao.prepareStatement(comando);
			
			
			p.setInt(1, marca.getId());
			p.setString (2, marca.getNome());

			//Executa o comando no BD 
			p.execute();

		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public List<JsonObject> buscarPorNome(String nomeMarca) {
		
	
	//inicia a criação do comando SQL de busca
	String comando = "SELECT * FROM marcas ";
	//Se o nome não estiver vazio...
	if (!nomeMarca.equals("")) {
		//concatena no comando where buscando no nome do produto
		//o texto da variável nome
		comando += "WHERE nome LIKE '%" + nomeMarca + "%' ";	
	}
	
	//Finaliza o comando ordenando alfabeticamente por
	//categoria, marca e depois modelo
	comando += "ORDER BY nome ASC";
	
	List<JsonObject> listaMarcas = new ArrayList<JsonObject>();
	JsonObject marcas = null;
	
	
	try {
		
		Statement stmt = conexao.createStatement();
		ResultSet rs = stmt.executeQuery(comando);
		
		while (rs.next()) {//abaixo é o que será feito em cada linha que virá do BD
			
			int id = rs.getInt("id");
			String nome = rs.getString("nome");
			int status = rs.getInt("status");
			
		
			marcas = new JsonObject();//criar códigos no formato JSON, mas como um objeto Java.
			marcas.addProperty("id", id);
			marcas.addProperty("nome", nome);
			marcas.addProperty("status", status);
			
			listaMarcas.add(marcas);
		}
		
	}catch (Exception e) {
		e.printStackTrace();
	}
	
			return listaMarcas;		
	}

	public boolean deletar(int id) {
	String comando = "DELETE FROM marcas WHERE id = ?";
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

	public Marca buscarPorId(int id) {
		String comando = "SELECT *FROM marcas WHERE marcas.id = ?";
		Marca marca = new Marca();
		try {
			PreparedStatement p = this.conexao.prepareStatement(comando); //Preparar o comando
			p.setInt(1, id);
			ResultSet rs = p.executeQuery();
			while (rs.next()) {
		
				String nome = rs.getString("nome");
				int status = rs.getInt("status");
				
				marca.setId(id);
				marca.setNome(nome);
				marca.setStatus(status);

			}
		}catch (SQLException e) {
			e.printStackTrace();
		
		}
		return marca;
	}

	public boolean alterar(Marca marca) {
		
		String comando = "UPDATE marcas " +"SET nome=?"
		+ " WHERE id=?";
// O id é pego através do proprio html quando clicamos na opção do produto especifico
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, marca.getNome());
			p.setInt(2, marca.getId());
			p.executeUpdate();

			//setado os valores alterados no produto
			
		
		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
		
	}

	public boolean verificaMarcaNoProduto(int id) {

		String comando = "SELECT * FROM produtos WHERE produtos.marcas_id = " + id;
		
		try {

			PreparedStatement p = this.conexao.prepareStatement(comando); // Preparar o comando
			ResultSet rs = p.executeQuery();

			while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
				
				
				return true;// produto encontrado com a marca especifica DELETE - not ok
			}
			return false;// nenhum produto com esta marca DELETE - ok
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
	
	public boolean ativaMarca(Marca marca) {
		
		int novoStatus = 1;
		if(marca.getStatus() == 1) {
			novoStatus = 0;
		}
		
		marca.setStatus(novoStatus);
		//com operador if ternário
		//marca.setStatus(marca.getStatus()==1?0:1);
		
		String comando = "UPDATE marcas SET status=?"
		+ " WHERE id=?";
		
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, marca.getStatus());
			p.setInt(2, marca.getId());
			p.executeUpdate();

			//setado os valores alterados no produto
			
		
		}catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
		
	}
	
	public boolean validaMarca(String nome) {
		String comando = "SELECT * FROM marcas WHERE marcas.nome = ?";
		try {
			
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setString(1,nome);
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
	
		public boolean validaInalteracao(Marca marca) {
			String comando = "SELECT * FROM marcas WHERE marcas.id = ? And marcas.nome= ?";
			
			try {
				
				PreparedStatement p = this.conexao.prepareStatement(comando);
				p.setInt(1,marca.getId());
				p.setString(2, marca.getNome());
				ResultSet rs = p.executeQuery();
				while (rs.next()) { //Se entrar aqui é porque ele conseguiu encontrar resultados no bd, assim pode retornar true
					return true;
					// Se a marca existir no bd pode deletar
				}
		return false;
			} catch (SQLException e) {
				e.printStackTrace();
			return false;
		}
		
	}
		
}// fim

