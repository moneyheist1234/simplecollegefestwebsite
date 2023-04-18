const express = require('express')
const mongoose = require('mongoose')

url = 'mongodb://0.0.0.0/library1'

mongoose.connect(url);

const con = mongoose.connection;

con.on('open', () => {
    console.log("DB connected");
})

con.on('error', (err)=> {
    console.log(err);
})

const app = express()
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));



app.get('/', (req, res) => {

    const books = [];
    con.collection('books').find()
    .forEach(book => books.push(book))
    .then( () => {
        res.status(200).send(books);
    })
    .catch(err => console.log(err));

})

app.get('/donate', (req, res) => {
    res.render('donateform')
})

app.post('/donatepost', (req, res) => {
    let newbook = {
        title : req.body.title,
        author : req.body.author,
        id : parseInt(req.body.id),
        count: parseInt(req.body.count)
    }

    con.collection('books').insertOne(newbook)
    .then((result)=>{
        res.status(200).send(result);

    })
    .catch(err => console.log(err));
})



app.get('/borrow', (req, res) => {
    res.render('borrowreturn');
})

app.post('/borrowpost', (req, res) => {

    myid = parseInt(req.body.id);
    op = req.body.op;
    if(op === 'borrow')
        amount = -1;
    else   
        amount = 1;

    con.collection('books').updateOne({id: myid}, {$inc: {count:amount}}, {upsert: true})
    .then((result) => {
        res.status(200).send(result);
    })
    .catch(err => console.log(err));
})


app.get('/delete/:id', (req, res)=>{
    con.collection('books').deleteOne({id: parseInt(req.params.id)})
    .then((result) => {
        res.status(200).send(result);
    })
    .catch(err => console.log(err));
})
app.listen(9000, () => {
    console.log("listening in 9000....")
})
