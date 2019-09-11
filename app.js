const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.get("/", function(request, response){
	response.render("home.hbs")
})

app.get("/about", function(request, response){
	response.render("about.hbs")
})

app.listen(8080)