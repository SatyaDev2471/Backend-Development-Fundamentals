# Lab 03 – REST API, Query Parameters, Validation and Debugging

## Student Details

- **Name:** SANGITHA TIRUMALA SATYA DEV
- **Registration Number:** 252U1R8085
- **Class:** CSE-QE-2B
- **Course:** Backend Development Fundamentals
- **Year:** II

## Objective

To develop a clean REST API using Node.js, Express.js and SQLite by implementing query parameters, search, sorting, pagination, price-range filtering, input validation, appropriate HTTP status codes and debugging techniques.

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- Postman
- npm

## Project Structure

```text
BDF_Lab-03/
├── screenshots/
│   ├── server-running.png
│   ├── get-all-books.png
│   ├── search-books.png
│   ├── sort-books.png
│   ├── pagination.png
│   ├── price-filter.png
│   ├── combined-filters.png
│   ├── get-single-book.png
│   ├── get-book-404.png
│   ├── post-success.png
│   ├── post-validation-error.png
│   ├── put-success.png
│   ├── put-404.png
│   ├── delete-success.png
│   └── delete-404.png
├── app.js
├── bookStore.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

1. Navigate to the project directory:

```bash
cd BDF_Lab-03
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Retrieve all books |
| GET | `/books/:bookId/` | Retrieve a specific book |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update a book |
| DELETE | `/books/:bookId/` | Delete a book |

## Query Parameters

The GET `/books/` endpoint supports the following query parameters:

| Parameter | Description |
|---|---|
| `search_q` | Search books by partial title |
| `order_by` | Sort using an allowed column |
| `order` | Sorting direction: ASC or DESC |
| `limit` | Maximum number of records |
| `offset` | Number of records to skip |
| `min_price` | Minimum book price |
| `max_price` | Maximum book price |

### Example Requests

Search:

```text
GET /books/?search_q=atomic
```

Sorting:

```text
GET /books/?order_by=price&order=ASC
```

Pagination:

```text
GET /books/?limit=3&offset=0
```

Price range:

```text
GET /books/?min_price=100&max_price=500
```

Combined filters:

```text
GET /books/?search_q=the&order_by=price&order=ASC&min_price=100&max_price=500&limit=5&offset=0
```

## Input Validation

The API validates book details before inserting or updating records.

- Title is required.
- Author is required.
- Price must be a valid number.
- Pages must be a positive integer when updating a book.

Invalid inputs return HTTP 400 with a JSON error message.

## HTTP Status Codes

| Status Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful GET, PUT and DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 404 | Not Found | Book does not exist |

## Database and Security

- SQLite is used for storing book records.
- Parameterized SQL queries are used to prevent SQL injection through user-provided values.
- Sorting columns and directions are restricted using allowlists.
- Database operations use asynchronous `await` calls.

## Postman Testing

The API is tested using Postman for:

- Retrieving all books and individual books.
- Searching books by title.
- Sorting books in ascending and descending order.
- Pagination using limit and offset.
- Filtering by minimum and maximum price.
- Applying combined filters.
- Adding books with valid and invalid input.
- Updating existing and non-existing books.
- Deleting existing and non-existing books.

## Screenshots

Screenshots of server execution and Postman API tests are available in the `screenshots/` directory.

## Learning Outcomes

- Understanding REST API design principles.
- Using query parameters for filtering and pagination.
- Implementing search and sorting functionality.
- Validating request body data.
- Handling HTTP status codes correctly.
- Writing parameterized SQLite queries.
- Debugging common Node.js and SQLite errors.
- Testing APIs using Postman.

## Author

**SANGITHA TIRUMALA SATYA DEV**  
B.Tech – Computer Science and Engineering  
Class: CSE-QE-2B