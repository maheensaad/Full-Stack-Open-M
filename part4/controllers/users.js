const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.username || !body.password) {
    return response.status(400).json({ error: 'Both username and password are required' });
  }

  if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
  }
  const existingUser = await User.findOne({ username: body.username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique' });
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
  })

module.exports = usersRouter