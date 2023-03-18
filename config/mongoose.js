const mongoose = require('mongoose');
const env = require('./enviornment');

mongoose.connect(`mongodb+srv://nijuprem7:nptestdb@cluster0.x2suycd.mongodb.net/?retryWrites=true&w=majority`);
const db = mongoose.connection;

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect("mongodb+srv://nijuprem7:nptestdb@cluster0.x2suycd.mongodb.net/?retryWrites=true&w=majority");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}