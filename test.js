const { Table } = require("tables.js")

let pessoas = new Table();
pessoas.addColumn("nome", "NOME VAZIO");
pessoas.addRow(6);
pessoas.setValue("nome", 0, "João");
pessoas.setValue("nome", 1, "Maria");
pessoas.setValue("nome", 2, "José");
pessoas.setValue("nome", 3, "Carlos");
pessoas.setValue("nome", 4, "Paulo");
let notas = new Table();
notas.addColumn("aluno");
notas.addColumn("nota", 0);
notas.addRow(3);
notas.setValue("aluno", 0, "João");
notas.setValue("nota", 0, 10);
notas.setValue("aluno", 1, "José");
notas.setValue("nota", 1, 5);
notas.setValue("aluno", 2, "Paulo");
notas.setValue("nota", 2, 8);
let r = pessoas.join(notas,
	function(leftRowIndex, rightRowIndex, leftTable, rightTable) {
		return (leftTable.getValue("nome", leftRowIndex) == rightTable.getValue("aluno", rightRowIndex));
	}
);
let q = r.query(["left.nome", "right.nota"]);
q.changeColumnName("left.nome", "nome");
q.changeColumnName("right.nota", "nota");
console.log(pessoas.getRowCount());
