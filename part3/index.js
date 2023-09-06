const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :res-time ms :req-body')
)

const url = process.env.MONGODB_URI

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.get('/info', (req, res) => {
  const currentDate = new Date().toLocaleString()
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  Person.find({}).then((persons) => {
    res.send(
      `<div>
        <p>Phonebook has info for ${persons.length} people</p>
      </div>
      <div>
        <p>${currentDate} (${timeZone})</p>
      </div>`
    )
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const personName = body.name
  const personNumber = body.number

  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: personName,
    number: personNumber
  })

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      res.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
