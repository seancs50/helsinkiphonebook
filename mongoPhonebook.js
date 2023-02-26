const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

/*
    MongoDB Atlas automatically creates a new database when an application tries to connect 
to a database that does not exist yet
    after you get your API key you can add 1 more path (/) before the query (?) 
and that path will be your DB name automatically
*/

const url = `mongodb://sean1:${password}@ac-6kvy95s-shard-00-00.ytrjd7q.mongodb.net:27017,ac-6kvy95s-shard-00-01.ytrjd7q.mongodb.net:27017,ac-6kvy95s-shard-00-02.ytrjd7q.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-11kq5t-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 5){
    const person = new Person({
    name: name,
    number: number,
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    }) 
}

if (process.argv.length === 3) {
    console.log('Phonebook: ')
    Person.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
}


/*
person.save().then(result => {
  console.log('contact saved!')
  Person.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    
  mongoose.connection.close()
  console.log('connection closed')
    })
})
*/

/*
N.B
Note.find({ important: true }).then(result => {
  // ...
})
*/
/*
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
*/
/*
Person.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
*/
