const db = require('./db');
const familias = [
  ['Maria','Vereda Grande',1,'ativo',1,1,1],['Raimunda','Brejo Bonito',1,'ativo',1,1,1],['Antônia','Olho d’Água',1,'ativo',1,1,1],['Francisca','Vereda Grande',1,'ativo',1,1,1],['Luzia','Brejo Bonito',1,'ativo',1,1,1],['Conceição','Olho d’Água',1,'ativo',1,1,1],['Joana','Vereda Grande',1,'ativo',1,1,1],['Benedita','Brejo Bonito',1,'vence_em_breve',1,1,1],['Rosa','Olho d’Água',1,'ativo',1,1,1],['Teresa','Vereda Grande',1,'ativo',1,1,1],['Sebastiana','Brejo Bonito',1,'ativo',1,1,1],['Edna','Olho d’Água',1,'ativo',1,1,1],['Lúcia','Vereda Grande',1,'ativo',1,1,1],['Marlene','Brejo Bonito',1,'ativo',1,1,1],['Iracema','Olho d’Água',1,'vencido',1,1,1],['Socorro','Vereda Grande',1,'ativo',1,1,0],['Josefa','Brejo Bonito',1,'ativo',1,1,1],['Ana','Olho d’Água',1,'ativo',1,1,1],['Rita','Vereda Grande',1,'ativo',1,1,1],['Cícera','Brejo Bonito',1,'ativo',1,1,1],['Zilda','Olho d’Água',1,'ativo',1,1,1],['Graça','Vereda Grande',1,'ativo',1,1,1],['José','Brejo Bonito',0,'ativo',1,1,1],['Benedito','Olho d’Água',0,'ativo',1,1,1],['Pedro','Vereda Grande',0,'ativo',1,1,1],['Raimundo','Brejo Bonito',0,'ativo',1,1,1],['Antônio','Olho d’Água',0,'ativo',1,1,1],['João','Vereda Grande',0,'ativo',1,1,1],['Manoel','Brejo Bonito',0,'ativo',1,0,1],['Francisco','Olho d’Água',0,'sem',1,1,1]
];
const regras = [
 ['babacu','Amêndoa de babaçu','BAB',2026,3.72,'Conab: preço pago no MA em mar/2026',7,3,'SocioBio Mais: valor fixo de 2026'],
 ['babacu','Amêndoa de babaçu','BAB',2027,3.72,'Conab: preço pago no MA em mar/2026',9.15,null,'Preço mínimo de 2027 (Portaria MAPA 965/2026). Valor da subvenção de 2027 ainda não publicado'],
 ['bacuri','Polpa de bacuri','BAC',2026,38,'Preço citado por agricultor dos Gerais de Balsas (Agência Brasil, nov/2025)',null,null,'Sem preço mínimo da Conab'],
 ['bacuri','Polpa de bacuri','BAC',2027,38,'Preço citado por agricultor dos Gerais de Balsas (Agência Brasil, nov/2025)',null,null,'Sem preço mínimo da Conab'],
 ['buriti','Polpa de buriti','BUR',2026,20,'Simulado',null,null,null],['buriti','Polpa de buriti','BUR',2027,20,'Simulado',null,null,null],
 ['farinha','Farinha de mandioca','FAR',2026,7,'Simulado',null,null,null],['farinha','Farinha de mandioca','FAR',2027,7,'Simulado',null,null,null],
 ['feijao','Feijão','FEI',2026,8,'Simulado',null,null,null],['feijao','Feijão','FEI',2027,8,'Simulado',null,null,null]
];
const vendas = [
 ['FEI-0030','Ana','feijao',90,8,'Escola Municipal (exemplo)','merenda','emitida',0,12],['BAC-0031','Joana','bacuri',6,38,'Cooperativa de Polpas do Cerrado (exemplo)','cooperativa','pendente',0,10],['BUR-0032','Pedro','buriti',12,20,'Cooperativa de Polpas do Cerrado (exemplo)','cooperativa','emitida',0,9],['FAR-0033','Teresa','farinha',45,7,'Escola Municipal (exemplo)','merenda','emitida',0,8],['BAB-0034','Rosa','babacu',60,3.72,'Comprador local','atravessador','emitida',180,7],['BAC-0035','Conceição','bacuri',8,38,'Feira de Balsas','feira','pendente',0,6],['FEI-0036','Benedito','feijao',120,8,'Escola Municipal (exemplo)','merenda','emitida',0,5],['BAB-0037','Luzia','babacu',140,3.72,'Comprador local','atravessador','pendente',0,4],['BUR-0038','Antônia','buriti',15,20,'Cooperativa de Polpas do Cerrado (exemplo)','cooperativa','emitida',0,3],['BAC-0039','Francisca','bacuri',10,38,'Cooperativa de Polpas do Cerrado (exemplo)','cooperativa','emitida',0,2],['FAR-0040','José','farinha',60,7,'Escola Municipal (exemplo)','merenda','emitida',0,2],['BAB-0041','Raimunda','babacu',85,3.72,'Comprador local','atravessador','emitida',255,1]
];
const pend = [['Luzia','nota','Falta a nota da venda de babaçu (BAB-0037). Com a nota, ela pode pedir R$ 420,00 de subvenção.'],['Conceição','nota','Falta a nota da venda de bacuri na feira (BAC-0035).'],['Joana','nota','Falta a nota da venda de bacuri (BAC-0031).'],['Benedita','caf','O CAF vence em 12 dias.'],['Iracema','caf','O CAF venceu. Precisa renovar com a entidade que emite o CAF.'],['Francisco','caf','Ainda não tem CAF.'],['Manoel','sican','Não tem cadastro no Sican, necessário para pedir a subvenção.'],['Socorro','pix','Não tem conta ou Pix cadastrado para receber.'],['Josefa','documento','Falta a foto do documento de identidade.']];
function seed() {
  const tx = db.transaction(() => {
    db.exec('DELETE FROM vendas; DELETE FROM pendencias; DELETE FROM familias; DELETE FROM regras; DELETE FROM config;');
    const fi=db.prepare('INSERT INTO familias(nome,comunidade,municipio,mulher,caf,cpf_ok,sican_ok,pix_ok) VALUES (?,?,?,?,?,?,?,?)');
    const ids={}; familias.forEach(f=>{ids[f[0]]=fi.run([f[0],f[1],'Balsas',...f.slice(2)]).lastInsertRowid;});
    const ri=db.prepare('INSERT INTO regras(slug,produto,prefixo_lote,vigencia,preco_referencia,fonte_preco,preco_minimo,subvencao_kg,observacao) VALUES (?,?,?,?,?,?,?,?,?)'); regras.forEach(r=>ri.run(r));
    db.prepare('INSERT INTO config(chave,valor) VALUES (?,?)').run('vigencia_ativa','2026');
    const vi=db.prepare('INSERT INTO vendas(lote,familia_id,produto,kg,preco_kg,valor,comprador,canal,nota,nota_numero,subvencao,criado_em) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    let nf=101; vendas.forEach(v=>vi.run(v[0],ids[v[1]],v[2],v[3],v[4],v[3]*v[4],v[5],v[6],v[7],v[7]==='emitida'?`NFA-e ${String(nf++).padStart(6,'0')}`:null,v[8],new Date(Date.now()-v[9]*86400000).toISOString()));
    const pi=db.prepare('INSERT INTO pendencias(familia_id,tipo,descricao) VALUES (?,?,?)'); pend.forEach(p=>pi.run(ids[p[0]],p[1],p[2]));
  }); tx();
}
module.exports = { seed };
