create database mercado;
use mercado;
create table categoria (
idcategoria int not null primary key auto_increment,
descricao varchar(45)
);
insert into categoria values(1, "Higiene pessoal");
insert into categoria values(2, "Limpeza");
insert into categoria values(3, "Cama, mesa e banho");
insert into categoria values (4, "Frios");
insert into categoria values (5, "Bazar");

select descricao from categoria WHERE descricao like 'H%';
select descricao from categoria WHERE descricao like '%banho';
select descricao from categoria WHERE descricao like '%es%';
update categoria set descricao='Frios e laticínios' where idcategoria=4 ;
delete from categoria where idcategoria=5;
/***********************************OT2 - BANCO DE DADOS***************************************/
create table produto (
idproduto int not null primary key auto_increment,
descricao varchar(45),
preco float,
idcategoria int,
constraint fkcategoria foreign key (idcategoria)
references categoria (idcategoria));
/* Duas linhas acima, criam a partir da coluna idcategoria da tabela produtos
uma chave estrangeira, que nesse caso é a coluna idcategoria da tabela categoria*/ 
insert into produto values(1,"Escova dental",3.50,1);
insert into produto values(2,"Creme dental",2.90,1);
insert into produto values(3,"Presunto",4.99,4);
insert into produto values(4,"Lençoi 180 Fios",85.80,3);
insert into produto values(5,"Desinfetante",6.99,2);

/*Selecione todos os campos da tabela produto e a descrição de sua categoria, cujo produto seja da categoria “Higiene pessoal”;*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria=1;

/*Selecione apenas o preço de todos os produtos da tabela produto e a descrição de sua categoria, cuja categoria seja “Limpeza”;*/
select pro.preco, cat.descricao
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria=2;

 /*Selecione a descrição do produto, preço do produto e descrição da categoria de todos os produtos da tabela produto;*/
 select pro.descricao,pro.preco,cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria !=0;

 
/*Selecione todos os campos da tabela produto e a descrição de sua categoria,
 cujo os produtos sejam da categoria “Higiene pessoal” e cuja descrição do produto termine com a palavra “dental”;*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria=1 and pro.descricao like "%dental";

/*Selecione todos os produtos da categoria “higiene pessoal” ou “limpeza”;*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria=2 or pro.idcategoria=1;

/*Selecione todos os produtos onde sua categoria seja diferente de “frios e laticínios” ;*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria!=4;

/*Selecione os produtos que não estejam na categoria “cama, mesa e banho” e “limpeza”*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
inner join categoria as cat
on pro.idcategoria = cat.idcategoria
where pro.idcategoria!=2 and pro.idcategoria!=3;

/*Selecione todas as categorias com todos seus produtos, inclusive aquelas que não possuem produto*/
select pro.idproduto,pro.preco,pro.descricao,pro.idcategoria, cat.descricao 
from produto as pro
right join categoria as cat
on pro.idcategoria =cat.idcategoria ;
insert into categoria values(5, "Carnes");
/***********************************************OT3 - BANCO DE DADOS*******************************************************/
Create table vendas (
idvenda int not null primary key auto_increment,
data_venda date);
insert into vendas values(1,"2017-01-23");
insert into vendas values(2,"2017-11-04");
insert into vendas values(3,"2017-07-07");
insert into vendas values(4,"2017-07-08");
insert into vendas values(5,"2017-07-09");
insert into vendas values(6,"2017-07-10");

create table vendas_has_produto(
idvenda int,
idproduto int,
quantidade int,
constraint fkvenda foreign key (idvenda)
references vendas (idvenda),
constraint fkproduto foreign key (idproduto)
references produto (idproduto),
primary key (idvenda, idproduto));

/*constraint fkdescricao foreign key (descricao)
references produto (descricao),
primary key (idvenda, idproduto, descricao));*/

insert into vendas_has_produto values(1, 1, 5);
insert into vendas_has_produto values(1, 2, 2);
insert into vendas_has_produto values(1, 4, 6);
insert into vendas_has_produto values(2, 1, 2);
insert into vendas_has_produto values(3, 4, 1);
insert into vendas_has_produto values(3, 1, 4);
insert into vendas_has_produto values(4, 2, 2);
insert into vendas_has_produto values(4, 1, 3);
insert into vendas_has_produto values(5, 4, 4);
insert into vendas_has_produto values(6, 2, 1);

/*Selecione todos campos das vendas, onde o produto “Escova dental” tenha sido vendido;*/
select ven.idvenda, ven.data_venda, venpro.quantidade
from vendas as ven 
inner join vendas_has_produto as venpro
on venpro.idvenda = ven.idvenda
where venpro.idproduto = 1;

/*Selecione a data das vendas onde o produto “Creme dental” tenha sido vendido;*/
select ven.idvenda, ven.data_venda, venpro.quantidade
from vendas as ven 
inner join vendas_has_produto as venpro
on venpro.idvenda = ven.idvenda
where venpro.idproduto = 2;

/*Selecione todas as descrições dos produtos da venda que ocorreu no dia “23/01”;*/
select pro.idproduto, pro.descricao, venpro.quantidade
from produto as pro 
inner join vendas_has_produto as venpro
on venpro.idproduto = pro.idproduto
where venpro.idvenda = 1;

/*Selecione a descrição todas as categorias de produtos que foram vendidos;*/
select distinct cat.idcategoria, cat.descricao, venpro.idproduto, produto.descricao
from categoria as cat
inner join produto 
on produto.idcategoria = cat.idcategoria
inner join vendas_has_produto as venpro
on produto.idproduto = venpro.idproduto;

/*Codigo sql para retirar repetição de registro*/

/*Selecione todas as vendas que não sejam da categoria “Higiene pessoal’;*/ /* VER*/
select vendas.idvenda, venpro.quantidade, produto.descricao, categoria.descricao
from vendas
inner join vendas_has_produto as venpro
on vendas.idvenda = venpro.idvenda
inner join produto 
on produto.idproduto = venpro.idproduto
inner join categoria 
on produto.idcategoria = categoria.idcategoria
where categoria.idcategoria != 1;
/**********************************************OT4 - BANCO DE DADOS********************************************************/
/*Mostre o total de vendas em que o produto “Escova dental” foi vendido. Chame o resultado dessa consulta de “total_venda_escovas”;*/
select count(idvenda) as total_venda_escovas 
from vendas_has_produto as venpro
 where venpro.idproduto = 1;

/*Mostre o valor total da venda de id “2” (considere o preço dos produtos vendidos e sua quantidade);*/
select sum(produto.preco*quantidade) as tota_id2
from vendas_has_produto
inner join produto
on produto.idproduto = vendas_has_produto.idproduto
where vendas_has_produto.idvenda = 2;

/*Mostre o valor total da venda do dia 23/01;*/
select sum(produto.preco*quantidade) as total_2301
from vendas_has_produto
inner join produto
on produto.idproduto = vendas_has_produto.idproduto
where vendas_has_produto.idvenda = 1;

/*Mostre a média dos valores dos produtos da venda do dia 23/01. Chame o resultado dessa consulta de “media_produtos”;*/
select avg(preco) as media_produtos
from produto 
inner join vendas_has_produto
on produto.idproduto = vendas_has_produto.idproduto
where vendas_has_produto.idvenda = 1;

/*Selecione a descrição do produto e seu valor, do produto com maior preço cadastrado (sem join);*/
select descricao, preco
from produto 
where preco = (select max(preco) from produto);

/*Mostre os produtos da venda do dia 07/07. Porém, apenas dos produtos que tenha valor acima de R$4,00;*/
select pro.preco,pro.idproduto,pro.descricao,pro.idcategoria,vendas_has_produto.idvenda,vendas.data_venda
from produto as pro
inner join vendas_has_produto
on pro.idproduto = vendas_has_produto.idproduto
inner join vendas
on vendas.idvenda = vendas_has_produto.idvenda
where vendas_has_produto.idvenda = 3 and pro.preco >4;

/*Verifique qual foi o produto mais vendido;*/
select pro.idproduto, pro.descricao, sum(quantidade) as quantidade_total
from produto as pro
inner join vendas_has_produto
on pro.idproduto = vendas_has_produto.idproduto
group by descricao, idproduto
order by quantidade_total desc
limit 1;

/*Selecione o produto mais barato no sistema;*/
select * from produto
where preco = (select min(preco) from produto);


/*Selecione o dia que que houve a menor quantidade de produtos vendidos (menos se vendeu);*/
select vendas.data_venda, vendas.idvenda, vendas_has_produto.quantidade 
from vendas_has_produto
inner join vendas
on vendas.idvenda = vendas_has_produto.idvenda
where vendas_has_produto.quantidade > (select min(quantidade) from vendas_has_produto )
order by quantidade asc
limit 3
;

/*Selecione o nome das categorias que tiveram produtos vendidos;*/
select distinct produto.descricao, categoria.idcategoria, categoria.descricao from produto
inner join vendas_has_produto
on vendas_has_produto.idproduto = produto.idproduto
inner join categoria 
on categoria.idcategoria = produto.idcategoria;


/*Selecione quantas vendas foram realizadas e nomeie de total_qtd_vendas;*/
select count(distinct idvenda) as total_qtd_vendas from vendas_has_produto;

/*Selecione o total de vendas entre os dias 08-07 e 10-07;*/
select count(distinct vendas_has_produto.idvenda) as total_qtd_vendas from vendas_has_produto
inner join vendas
on vendas.idvenda = vendas_has_produto.idvenda
where vendas.data_venda between "2017-07-08" and "2017-07-10";

/*Selecione todas as vendas com o total por dia e ordene do dia mais atual ao mais antigo;*/
select distinct vendas.data_venda, vendas.idvenda, vendas_has_produto.quantidade, count(quantidade) as total_dia
from vendas_has_produto
inner join vendas
on vendas.idvenda = vendas_has_produto.idvenda
group by idvenda
order by data_venda desc;


/*Selecione todas as vendas com seus totais e o dia, ordene pelo dia mais lucrativo;*/
select distinct vendas.data_venda, vendas_has_produto.idvenda, sum(vendas_has_produto.quantidade) as quantidade_total, count(quantidade) as total_dia, sum(preco*quantidade) as valor_total
from vendas_has_produto
inner join vendas
on vendas.idvenda = vendas_has_produto.idvenda
inner join produto
on produto.idproduto = vendas_has_produto.idproduto
group by idvenda
order by valor_total desc;

/**********************************************OT5 - BANCO DE DADOS********************************************************/
create table endereco(
idendereco int not null auto_increment primary key ,
rua varchar(45),
bairro varchar(45),
numero int,
cidade varchar(45))
;

create table vendedor(/*informações do endereço devem estar com o vendedor, mas não o contrário*/
idvendedor int not null primary key auto_increment,
nome varchar(45),
salario float,
data_nasc date,
idendereco int,
constraint fkendereco foreign key (idendereco)
references endereco (idendereco)
);

insert into endereco values(1, "rua", "bairro", 22, "cidade");

/**********************************************OT6 - BANCO DE DADOS********************************************************/

create view vendedores_vw AS SELECT idvendedor, nome, data_nasc, idendereco FROM vendedor;

create view produtos_vw AS SELECT produto.descricao, produto.preco, categoria.descricao as categoria FROM produto
inner join categoria 
on categoria.idcategoria = produto.idcategoria;


/**********************************************OT7 - BANCO DE DADOS********************************************************/
/*Agora, crie uma trigger para que quando o salário de um vendedor seja alterado, ele não possa ser menor do que o já cadastrado.*/
delimiter $$
CREATE TRIGGER salario_maior
before update 
on vendedor
for each ROW
BEGIN 
	if NEW.salario < OLD.salario then
    set NEW.salario = OLD.salario;
END if;
END $$;
delimiter ;

/*Crie uma trigger para que quando seja inserido um novo vendedor altere o salário dele para R$998,00*/
delimiter $$
CREATE TRIGGER salario_padrao
before insert 
on vendedor
for each ROW
BEGIN 
	set NEW.salario = 998;
END $$;
delimiter ;
insert into vendedor values(2, "allace", "4.000", 08/02/2001, 1);

/*Crie uma trigger para que quando um vendedor for deletado do banco seja inserido um novo vendedor com o salário igual a R$10,00;
delimiter $$
CREATE TRIGGER vendedor_novo
after DELETE 
on vendedor
for each ROW
BEGIN 
        INSERT into vendedor values(OLD.idvendedor, "Marlow","10",08/02/2001,1);
END $$;
delimiter ;
não é possivel alterar algo da tabela que esta sendo trabalhada*/

/*Imagine alguma outra situação onde seja interessante criar uma trigger, dentro da proposta em que estamos trabalhando e faça-a.*/



/**********************************************OT8 - BANCO DE DADOS********************************************************/

/*Agora, crie uma procedure para atualizar o preço de um produto. Para isso, a procedure deve receber o id do produto e o novo preço dele.*/
DELIMITER $$
CREATE PROCEDURE atualiza_preco (in id int, in preco_novo float)
BEGIN
 update  produto
 set produto.preco = preco_novo
 where produto.idproduto = id;
END $$;
DELIMITER ;
CALL atualiza_preco(2, 100);
drop procedure atualiza_preco;

/*Crie uma procedure onde aumente o valor de todos os produtos em 10%;*/
DELIMITER $$
CREATE PROCEDURE aumenta_preco ()
BEGIN
 update  produto
 set produto.preco = produto.preco*0.1 + preco
 where produto.idproduto != 0;
END $$;
DELIMITER ;
CALL aumenta_preco();
drop procedure aumenta_preco;

/*Crie uma procedure onde some a quantidade vendida de um produto e aumente o valor do mesmo utilizando a soma da quantidade como porcentagem, ou seja,
 se foram vendidas 15 escovas de dente o valor de escova de dente deve aumentar em 15%;*/
 
DELIMITER $$
CREATE PROCEDURE  soma_preco_quant(in id int)
BEGIN
declare soma_quantidade int;
select sum(vendas_has_produto.quantidade) from vendas_has_produto  where vendas_has_produto.idproduto = id into soma_quantidade;
update produto
set produto.preco = soma_quantidade*produto.preco/100 + produto.preco
where produto.idproduto = id;
END $$;
DELIMITER ;

CALL soma_preco_quant(2);
/* round() te permite usar o que esta no parenteses*/
drop procedure soma_preco_quant;

/*Da mesma forma que você fez para view e trigger, imagine alguma outra situação onde seja interessante criar uma procedure,
 dentro da proposta em que estamos trabalhando e faça-a.*/


/*Atividade para discussão: recapitule, desde a primeira OT dessa trilha sobre a ordem em que as tabelas foram aparecendo. Você consegue enxergar uma lógica nessa sequência? Analise, faça suas observações e também traga para discussão com seu orientador.x*/
