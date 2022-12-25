const { 
  addBookHandler, 
  getAllBooksHandler,
  // getAllBooksByNameHandler, 
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHanlder,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/hello',
    handler: (request, h) => {
      const { query } = request.query;
      const res = (query === undefined) ? 'nopal' : query;
      return { status: 'success', data: res };
    },
  },
  // {
  //   method: 'GET',
  //   path: '/books/{name?}',
  //   handler: getAllBooksByNameHandler,
  // },
  // {
  //   method: 'GET',
  //   path: '/books/{reading?}',
  //   handler: () => {},
  // },
  // {
  //   method: 'GET',
  //   path: '/books/{finished?}',
  //   handler: () => {},
  // },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHanlder,
  },
];

module.exports = routes;
