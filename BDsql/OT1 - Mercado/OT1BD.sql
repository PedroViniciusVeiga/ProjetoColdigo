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
select * from categoria;
select descricao from categoria WHERE descricao like 'H%';
select descricao from categoria WHERE descricao like '%banho';
select descricao from categoria WHERE descricao like '%es%';
update categoria set descricao='Frios e laticínios' where idcategoria=4 ;
delete from categoria where idcategoria=5;
