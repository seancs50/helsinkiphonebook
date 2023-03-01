// store enviroment variables in render enviroment WITHOUT QUOTATION MARKS!!
require('dotenv').config()

const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

// dont forget this to handle json POST requests!!
app.use(express.json())

const Person = require('./models/person')

// define new token
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    //console.log('Body2:  ', request['body'])
    console.log('---')
    next()
  }
app.use(requestLogger)


// DO NOT EVER FORGET THE LEADING FORWARD SLASH '/API....'
app.get('/',(request,response) => {
    response.send('<h1>This is the Homepage!<h1>')
})
/*
app.get('/api/persons', (request,response) => {
    response.json(data)
})
*/
app.get('/api/persons', (request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
  .catch(error => next(error))
})

app.get("/info", (request,response, next) => {
  const date = new Date().toString()
  console.log(date)
  Person.find({}).then(persons => {
    response.send(`<h1>phonebook has info for ${persons.length} people</h1><br><h1>${date}</h1>`)
  })
  .catch(error => next(error))
})
    
/*   
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  const person = data.find(person => person.id === id)
  console.log(person.name)
  //console.log(person["name"])
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end
  }
  
})
*/

app.put('/api/persons/:id',(request, response, next) => {
  console.log("called!")
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  // [options.new=false] «Boolean» if true, return the modified document rather than the original
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
    })
    .catch(error => next(error))
})
    
/*
app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    console.log(id)
    data = data.filter(person => person.id !== id)
    
    console.log(data)
    response.status(204).end()
})
*/

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next ) => {
    const body = request.body
    //const unique = data.find(person => person.name === body.name)
    console.log(body)
    if (!body.name ){
      return response.status(400).json(
            {error:'no name  entered'}
            )}
    if (!body.number){
        return response.status(400).json({
            error:"no number entered"
        })
    }
    //const Person = mongoose.model('Person', personSchema)
    const entry = new Person({
      name: body.name,
      number: body.number,
      })
    entry.save().then(result => {
        console.log(`added ${body.name} number ${body.number} to phonebook`)
        console.log(JSON.stringify(result))
          response.json(result)
          })
          .catch(error => next(error))
        })

    /*
    if (unique) {
        return response.status(400).json({
            error: "name already exists"
        })
    }
    
    const getRandomInt = (max)  => Math.floor(Math.random() * max)
    id = getRandomInt(10000)
    name = body.name
    number = body.number
    const person = {
        name: name,
        number: number,
    }
    data = data.concat(person)//// this shoudda been in the front end
    console.log(data)
    response.json(data)
})
*/

// this will only be called if there is no matching route...thats why it is at the bottom

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

//https://expressjs.com/en/guide/error-handling.html
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server running on ${PORT}`)
})
