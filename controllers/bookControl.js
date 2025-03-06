const book = require('../models/bookModel');
const mongoose = require('mongoose');





const addBook = async (req, res) => {
    try{
        const {name, category, date, addedBy, image} = req.body;
        
        //validation 
        if(!name){
            return res.status(400).json({error: 'name is required'})
        }

        if(!category){
            return res.status(400).json({error: 'category is required'})
        }

        if(!date){
            return res.status(400).json({error: 'date is required'})
        }

        if(!addedBy){
            return res.status(400).json({error: 'addBy  is required'})
        }

        if(!image){
            return res.status(400).json({error: 'image is required'})
        }

        const newBook = new book({
            name,
            category,
            date,
            image,
            addedBy: req.user._id  
         });
   
         await newBook.save();
         res.status(201).json({ message: "Book added successfully", book: newBook });

    }
    catch(error){
       console.log('internal server error', error);
    };
}

const updateBook = async (req, res) => {
    try {
        const { _id } = req.params; 
        const updateData = req.body;

        
        console.log("Received _id:", req.params._id);
        console.log("Update Data:", updateData);

        
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

       
        const existingBook = await book.findById(_id);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found in database" });
        }

       
        const updatedBook = await book.findByIdAndUpdate(
            _id,
            updateData,
            { new: true } 
        );

        console.log("Updated Book:", updatedBook);

        res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        console.error("Error in book updation:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteBook = async (req, res) => {
    try {
        const { _id } = req.params; 

        console.log("Received ID for deletion:", _id);

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid book ID" });
        }

        
        const deletedBook = await book.findByIdAndDelete(_id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        
        res.status(200).json({ message: "Book deleted successfully", deletedBook });

    } catch (error) {
        console.error("Error in deleteBook:", error);
        res.status(500).json({ message: "Server error" });
    }
};





module.exports = {addBook, updateBook, deleteBook};