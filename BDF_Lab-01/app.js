const express = require('express')
const app = express()

// Route 1: Home
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my Node.js and Express server!')
})

// Route 2: About
app.get('/about', (request, response) => {
  response.status(200).json({
    name: 'S Tirumala Satya Dev',
    section: 'CSE-QE-2B & S-13',
    registration_no: '252U1R8085',
  })
})

// Route 3: Current Date and Time
app.get('/time', (request, response) => {
  const currentDateTime = new Date()

  response.status(200).json({
    dateTime: currentDateTime,
  })
})

// Route 4: Handle unknown paths
app.use((request, response) => {
  response.status(404).send('404 - Page Not Found')
})

// Start server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})