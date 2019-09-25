const express = require('express')
const db = require('./db')

const router = express.Router()

// GET /humans
router.get("/", function(request, response){
	
	db.getAllHumans(function(error, humans){
		
		if(error){
			
			const model = {
				somethingWentWrong: true
			}
			
			response.render("humans.hbs", model)
			
		}else{
			
			const model = {
				somethingWentWrong: false,
				humans
			}
			
			response.render("humans.hbs", model)
			
		}
		
	})
	
})

// GET /humans/create
router.get("/create", function(request, response){
	const model = {
		validationErrors: []
	}
	response.render("create-human.hbs", model)
})

// GET /humans/123
router.get("/:id", function(request, response){
	
	const id = request.params.id // 123
	
	response.cookie("previouslyViewedHumanId", id)
	
	db.getHumanById(id, function(error, human){
		
		if(error){
			
		}else{
			
			const model = {
				human
			}
			
			response.render("human.hbs", model)
			
		}
	})
	
})

// POST /humans/create
// Body: name=Alice&age=10
router.post("/create", function(request, response){
	
	const name = request.body.name
	const age = request.body.age // TODO: You probably want to convert this into integer.
	
	const validationErrors = []
	
	if(name == ""){
		validationErrors.push("Must enter a name.")
	}
	
	if(age == ""){
		validationErrors.push("Must enter an age.")
	}
	
	if(response.locals.isLoggedIn){
		validationErrors.push("Not logged in")
	}
	
	// TODO: you probably want to use other validation rules (min/max length on username, min/max values on age).
	
	if(validationErrors.length == 0){
		
		db.createHuman(name, age, function(error, id){
			if(error){
				
			}else{
				response.redirect("/humans/"+id)
			}
		})
		
	}else{
		
		const model = {
			validationErrors,
			name,
			age
		}
		
		response.render("create-human.hbs", model)
		
	}
		
})

module.exports = router