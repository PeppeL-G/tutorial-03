const express = require('express')
const expressHandlebars = require('express-handlebars')

const humans = [{
	id: 1,
	name: "Alice",
	age: 10
}, {
	id: 2,
	name: "Bob",
	age: 15
}, {
	id: 3,
	name: "Claire",
	age: 20
}]

const app = express()

app.use(express.static("public"))

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.get("/", function(request, response){
	response.render("home.hbs")
})

app.get("/about", function(request, response){
	response.render("about.hbs")
})

app.get("/humans", function(request, response){
	
	const model = {
		humans
	}
	
	response.render("humans.hbs", model)
	
})

// GET /humans/123
app.get("/humans/:id", function(request, response){
	
	const id = request.params.id // 123
	
	const human = humans.find(h => h.id == id)
	
	const model = {
		human
	}
	
	response.render("human.hbs", model)
	
})

app.listen(8080)