const { nanoid } = require('nanoid');
const Books = require('./books');

const addBookHandler = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading, 
    } = request.payload;
  
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
  
    const newBook = {
      id, 
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      finished, 
      reading, 
      insertedAt, 
      updatedAt,
    };
  
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    
    Books.push(newBook);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: `Buku gagal ditambahkan, ${error}`,
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const selectProps = (...props) => (obj) => {
    const newObj = {};
    props.forEach((name) => {
      newObj[name] = obj[name];
    });
    return newObj;
  };

  const { name, reading, finished } = request.query;

  let books = JSON.parse(JSON.stringify(Books));

  if (reading !== undefined) {
    if (reading === '1') {
      books = books.filter((book) => book.reading === true);
    } else if (reading === '0') {
      books = books.filter((book) => book.reading === false);
    }
  }

  if (finished !== undefined) {
    if (finished === '1') {
      books = books.filter((book) => book.finished === true);
    } else if (finished === '0') {
      books = books.filter((book) => book.finished === false);
    }
  }

  if (name !== undefined) {
    books = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  books = books.map(selectProps('id', 'name', 'publisher'));

  return {
    status: 'success',
    data: {
      books,
    },
  };
};

// const getAllBooksByNameHandler = (request, h) => {
//   const { name } = request.query;

//   const books = Books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));

//   return {
//     status: 'success',
//     data: {
//       books,
//     },
//   };
// };

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = Books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  if (bookId === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(400);
    return response;
  }

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();

  const index = Books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    Books[index] = {
      ...Books[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading, 
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHanlder = (request, h) => {
  const { bookId } = request.params;

  const index = Books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    Books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { 
  addBookHandler,
  getAllBooksHandler,
  // getAllBooksByNameHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHanlder,
};
