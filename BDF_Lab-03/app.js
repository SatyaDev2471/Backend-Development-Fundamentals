const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'bookStore.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    console.log('Database Connected Successfully')

    const PORT = process.env.PORT || 3000

    app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Running at port ${PORT}`)
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/books/', async (request, response) => {
  let {search_q = '', order_by = 'id', order = 'ASC', limit = '10', offset = '0', min_price, max_price,} = request.query

  const allowedColumns = ['id', 'title', 'author', 'price', 'pages']

  if (!allowedColumns.includes(order_by)) {
    order_by = 'id'
  }

  order = order.toUpperCase()

  if (!['ASC', 'DESC'].includes(order)) {
    order = 'ASC'
  }

  limit = Number.parseInt(limit, 10)
  offset = Number.parseInt(offset, 10)

  if (!Number.isInteger(limit) || limit <= 0) {
    limit = 10
  }

  if (!Number.isInteger(offset) || offset < 0) {
    offset = 0
  }

  const conditions = []
  const params = []

  if (search_q.trim() !== '') {
    conditions.push('title LIKE ?')
    params.push(`%${search_q}%`)
  }

  if (min_price !== undefined) {
    conditions.push('price >= ?')
    params.push(Number(min_price))
  }

  if (max_price !== undefined) {
    conditions.push('price <= ?')
    params.push(Number(max_price))
  }

  let getBooksQuery = `SELECT * FROM book `

  if (conditions.length > 0) {
    getBooksQuery += ` WHERE ${conditions.join(' AND ')}`
  }

  getBooksQuery += ` ORDER BY ${order_by} ${order} LIMIT ? OFFSET ?;`

  params.push(limit, offset)

  const books = await db.all(getBooksQuery, params)

  response.send(books)
})

app.post('/books/', async (request, response) => {
  const {title, author, price, pages} = request.body

  if (!title || title.trim() === '') {
    return response.status(400).send({
      error: 'Title is required',
    })
  }

  if (!author || author.trim() === '') {
    return response.status(400).send({
      error: 'Author is required',
    })
  }

  if (price === undefined || price === null || price === '') {
    return response.status(400).send({
      error: 'Price is required',
    })
  }

  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return response.status(400).send({
      error: 'Price must be a valid number',
    })
  }

  const addBookQuery = `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)`

  await db.run(addBookQuery, [title, author, price, pages])

  return response.status(201).send({
    message: 'Book Added Successfully',
  })
})

app.put('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params
  const {title, author, price, pages} = request.body

  const getBookQuery = `SELECT * FROM book WHERE id = ?`

  const existingBook = await db.get(getBookQuery, [bookId])

  if (existingBook === undefined) {
    return response.status(404).send({
      error: 'Book not found',
    })
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return response.status(400).send({
      error: 'Title is required',
    })
  }

  if (!author || typeof author !== 'string' || author.trim() === '') {
    return response.status(400).send({
      error: 'Author is required',
    })
  }

  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return response.status(400).send({
      error: 'Price must be a valid number',
    })
  }

  if (!Number.isInteger(pages) || pages <= 0) {
    return response.status(400).send({
      error: 'Pages must be a positive integer',
    })
  }

  const updateBookQuery = `
    UPDATE book
    SET
      title = ?,
      author = ?,
      price = ?,
      pages = ?
    WHERE id = ?;
  `

  await db.run(updateBookQuery, [title, author, price, pages, bookId])

  return response.status(200).send({
    message: 'Book Updated Successfully',
  })
})

app.delete('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params

  const getBookQuery = `SELECT * FROM book WHERE id = ?`

  const existingBook = await db.get(getBookQuery, [bookId])

  if (existingBook === undefined) {
    return response.status(404).send({
      error: 'Book not found',
    })
  }

  const deleteBookQuery = `DELETE FROM book WHERE id = ?`

  await db.run(deleteBookQuery, [bookId])

  return response.status(200).send({message: 'Book Deleted Successfully'})
})

app.get('/books/:bookId/', async (request, response) => {
  const {bookId} = request.params

  const getBookQuery = `SELECT * FROM book WHERE id = ?`

  const book = await db.get(getBookQuery, [bookId])

  if (book === undefined) {
    return response.status(404).send({
      error: 'Book not found',
    })
  }

  return response.status(200).send(book)
})

module.exports = app
