const mongoose =require("mongoose");

mongoose.connect("mongodb://localhost:27017/Interior").then(() => {
    console.log(`connection successful`);
}).catch((e)=> {
    console.log(`no connection`);
})