const express =require('express');
const bodyParser = require('body-parser');
const routsHandler = require('./routes/handler');
const mongoose = require('mongoose');
require('dotenv/config');

mongoose.set('strictQuery', true)

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/", routsHandler);


//DB connection
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
console.log("DB connected");
})
.catch((err)=>{console.log(err);});

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT},`);

});
