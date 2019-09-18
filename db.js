const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("database.db")

db.run(`
	CREATE TABLE IF NOT EXISTS humans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		age INTEGER
	)
`)

exports.getAllHumans = function(callback){
	
	const query = "SELECT * FROM humans"
	
	db.all(query, function(error, humans){
		
		callback(error, humans)
		
	})
	
}

exports.getHumanById = function(id, callback){
	
	const query = "SELECT * FROM humans WHERE id = ?"
	const values = [id]
	
	db.get(query, values, function(error, human){
		callback(error, human)
	})
	
}

exports.createHuman = function(name, age, callback){
	
	const query = "INSERT INTO humans (name, age) VALUES (?, ?)"
	const values = [name, age]
	
	db.run(query, values, function(error){
		
		const id = this.lastID
		
		callback(error, id)
		
	})
	
}