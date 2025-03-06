const express = require('express');
const authMiddleware = require('../middleware/authUsers');
const {addBook, updateBook, deleteBook} = require('../controllers/bookControl');
// const { router } = require('../app');

const router = express.Router();

router.post('/add', authMiddleware, addBook);
  

router.put('/update/:_id', updateBook);

router.delete('/delete/:_id', deleteBook);
module.exports = router;


// {
//     "name": "women rights",
//     "category": "power",
//     "addedBy": "sneha",
//     "date": "23/2/2005",
//     "image": "http://power/img"
  
// }