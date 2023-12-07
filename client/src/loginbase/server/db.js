const mongoose = require("mongoose");

module.exports = () => {
    
try{
    const uri = "mongodb+srv://saahash:happylife@login.nquijq4.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Database connection successfully");
}
catch(error){
console.log("Could not connect to Database");
console.log(error);

}
}