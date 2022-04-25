package br.com.coldigogeladeiras.jdbcinterface;

import java.util.List;

import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.modelo.Marca;

public interface MarcaDAO {
	
	
	public List<Marca> buscar();
	public boolean inserir(Marca marca);
	public List<JsonObject> buscarPorNome(String nome);
	public boolean deletar (int id);
	public Marca buscarPorId(int id);
	public boolean alterar(Marca marca);
	public boolean verificaMarca(int id);
	public boolean verificaMarcaNoProduto(int id);
	public boolean ativaMarca(Marca marca);
	public boolean validaMarca(String nome);
	public boolean validaInalteracao(Marca marca);

}
