const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/MCQ');
// const DB =
//   'mongodb+srv://birajjyo2:uhnekDGnu6zglcFo@cluster0.kybvwzo.mongodb.net/MCQ';

// mongoose.connect(DB);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'erroe connecting to db'));
// up and running then message
db.once('open', function () {
  console.log('Success fully connected to the database');
});
