class Table {
	constructor() {
		this.headers = {}; //column name -> index
		this.defaultValues = []; //column index -> default column value
		this.data = []; //row index -> row (an array)
	}


	addColumn(name, defaultValue = null) {
		this.headers[name] = Object.keys(this.headers).length;
		this.defaultValues[this.headers[name]] = defaultValue;
		for (let rowData of this.data) {
			rowData.push(defaultValue);
		}
	}


	getColumnIndex(name) {
		return this.headers[name];
	}


	getColumnDefaultValue(colName) {
		return this.defaultValues[this.headers[colName]];
	}


	getColumnCount() {
		return Object.keys(this.headers).length;
	}


	getColumnNames() {
		let r = [];
		for (let colName in this.headers)
			r.push(colName);
		return r;
	}


	changeColumnName(currName, newName) {
		//to maintain header order, recreate the headers object while replacing this column name
		let newHeaders = {};
		for (const [colName, colIndex] of Object.entries(this.headers)) {
			if (colName != currName)
				newHeaders[colName] = colIndex;
			else
				newHeaders[newName] = colIndex;
		}
		this.headers = newHeaders;
	}


	getRow(index) {
		return this.data[index];
	}
	

	addRow(quantity = 1) {
		let prevRowCount = this.getRowCount();
		for (let r = 0; r < quantity; r++) {
			let rowData = [];
			for (let c = 0; c < this.getColumnCount(); c++) {
				rowData.push(this.defaultValues[c]);
			}
			this.data.push(rowData);
		}
		return prevRowCount; //return index of the first row added
	}


	insertRow(index) {
		let rowData = [];
		for (let c = 0; c < this.getColumnCount(); c++) {
			rowData.push(this.defaultValues[c]);
		}
		this.data.splice(index, 0, rowData);
		return index; //return index of the added row
	}


	removeRow(index) {
		this.data.splice(index, 1);
	}


	getRowCount() {
		return this.data.length;
	}


	getValue(colName, rowIndex) {
		let rowData = this.data[rowIndex];
		let colIndex = this.headers[colName];
		return rowData[colIndex];
	}


	setValue(colName, rowIndex, value) {
		let rowData = this.data[rowIndex];
		let colIndex = this.headers[colName];
		rowData[colIndex] = value;
	}


	join(other, callback, prefixLeft = "left", prefixRight = "right") {
		let result = new Table();
		//insert columns from this table first
		for (let colName in this.headers) {
			result.addColumn(prefixLeft + "." + colName, this.getColumnDefaultValue(colName));
		}
		//insert columns from the other table
		for (let colName in other.headers) {
			result.addColumn(prefixRight + "." + colName, other.getColumnDefaultValue(colName));
		}
		//insert data
		for (let r1 = 0; r1 < this.data.length; r1++) {
			for (let r2 = 0; r2 < other.data.length; r2++) {
				if (callback(r1, r2, this, other)) {
					let addedRow = result.getRow(result.addRow(1));
					let r = 0;
					for (let val of this.data[r1]) { //copy values from this table's row
						addedRow[r++] = val;
					}
					for (let val of other.data[r2]) { //copy values from other table's row
						addedRow[r++] = val;
					}
				}
			}
		}
		return result;
	}


	query(columnNames, callback = (rowIndex, table) => true) {
		if (!Array.isArray(columnNames)) {
			throw TypeError("parameter 'columnNames' must be an array");
		}
		let result = new Table();
		
		//add the specified columns to the resulting table
		let columnIndexes = [];
		for (let colName of columnNames) {
			columnIndexes.push(this.getColumnIndex(colName));
			result.addColumn(colName, this.getColumnDefaultValue(colName));
		}

		//copy the specified columns data
		let r = 0;
		for (let srcRowData of this.data) {
			if (callback(r, this)) {
				let destRowData = result.getRow(result.addRow(1));
				let destColIndex = 0;
				for (let srcColIndex of columnIndexes) {
					destRowData[destColIndex++] = srcRowData[srcColIndex];
				}
			}
			r++;
		}

		return result;
	}
}
