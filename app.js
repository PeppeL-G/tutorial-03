const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

// TODO: Structure the code better by putting this in a separate JS file.
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

app.use(bodyParser.urlencoded({
	extended: false
}))

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

// GET /
app.get("/", function(request, response){
	response.render("home.hbs")
})

// GET /about
app.get("/about", function(request, response){
	response.render("about.hbs")
})

// GET /humans
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

// GET /create-human
app.get("/create-human", function(request, response){
	const model = {
		validationErrors: []
	}
	response.render("create-human.hbs", model)
})


// POST /create-human
// Body: name=Alice&age=10
app.post("/create-human", function(request, response){
	
	const name = request.body.name
	const age = request.body.age // TODO: You probably want to convert this into integer.
	
	const validationErrors = []
	
	if(name == ""){
		validationErrors.push("Must enter a name.")
	}
	
	if(age == ""){
		validationErrors.push("Must enter an age.")
	}
	
	// TODO: you probably want to use other validation rules (min/max length on username, min/max values on age).
	
	if(validationErrors.length == 0){
		
		const human = {
			id: humans.length + 1, // TODO: Id will be re-used if the newest human is deleted (that's bad).
			name,
			age
		}
		
		humans.push(human)
		
		response.redirect("/humans/"+human.id)
		
	}else{
		
		const model = {
			validationErrors
		}
		
		response.render("create-human.hbs", model)
		
	}
		
})

app.listen(8080)