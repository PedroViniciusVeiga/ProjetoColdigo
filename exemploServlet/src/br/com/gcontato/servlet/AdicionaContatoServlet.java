package br.com.gcontato.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AdicionaContatoServlet extends HttpServlet{

	private static final long serialVersionUID = 1L;
	public AdicionaContatoServlet() {
		super();
	}
	@Override
	protected void service(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException{
		
		PrintWriter out = response.getWriter();
		String nome = request.getParameter("nome");

		out.print("Dados de contatos service"+"<br>"+
				"Nome do contato:"+nome+"<br>");
		
		out = response.getWriter();
		String fone = request.getParameter("fone");
		out.print("Telefone:"+fone+"<br>");
		
		out = response.getWriter();
		String end = request.getParameter("end");
		out.println("Endereço:"+end);
	}
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException{

	}
	
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response)
	throws ServletException, IOException{
		
	}
}
