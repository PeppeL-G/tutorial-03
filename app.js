const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const humansRouter = require('./humansRouters')

const db = require('./db')

const username = "Alice"
const password = "abc123"

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(cookieParser())

app.use(expressSession({
	secret: "lksjdlkjdslkfdsjslkdfj",
	saveUninitialized: false,
	resave: false,
	store: new SQLiteStore()
}))

// Fetch the previous human the client viewed.
app.use(function(request, response, next){
	
	const previouslyViewedHumanId = request.cookies.previouslyViewedHumanId
	
	db.getHumanById(previouslyViewedHumanId, function(error, human){
		
		response.locals.previouslyViewedHuman = human
		
		next()
		
	})
	
})

// Add info about if the user is logged in or not.
app.use(function(request, response, next){
	
	response.locals.isLoggedIn = request.session.isLoggedIn
	
	next()
	
})

app.use("/humans", humansRouter)

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

// GET /login
app.get("/login", function(request, response){
	response.render("login.hbs")
})

// POST /login
// Body: username=alice&password=abc123
app.post("/login", function(request, response){
	
	if(request.body.username == username && request.body.password == password){
		request.session.isLoggedIn = true
		response.redirect("/")
	}else{
		response.render("login.hbs")
	}
	
})

// POST /comments
// Body: name=alice&message=Nice!&humanId=12
app.post("/comments", function(request, response){
	
	const name = request.body.name
	const message = request.body.message
	const humanId = request.body.humanId
	
	// When creating a resource with a relation...
	const query = "INSERT INTO comments (name, message, humanId) VALUES (?, ?, ?)"
	const values = [name, message, humanId]
	
	db.run(query, values, function(error){
		
		// ...handle foreign key violation errors here!
		// (you can use error.message to figure out type of error)
		
	})
	
})

app.listen(8080)