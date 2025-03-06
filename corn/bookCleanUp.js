const cron = require('node-cron');  
const bookModel = require('../models/bookModel');

cron.schedule('0 0 * * *', async () => {
    try{
        console.log(" Checking for expired books...");

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await bookModel.deleteMany({ date: { $lt: oneMinAgo } }); 

        console.log(" Expired books deleted successfully!");
    }
    catch(error) {
        console.error(" Error deleting expired books:", error);
    }
});

module.exports = cron;
