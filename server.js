//REQUIRED DEPENDENCIES
const express = require('express')
const { unwatchFile } = require('fs')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
require('dotenv').config()

//DECLARED DB VARIABLES
let db,
  dbConnectionStr = process.env.DB_STRING
  dbName = 'star-trek-api'

//CONNECTED TO MONGODB
MongoClient.connect(dbConnectionStr)
  .then(client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName)
  })


  //SET MIDDLEWARE
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//CRUD METHODS
app.get('/', (req,res) =>{
  let contents = db.collection('alien-info').find().toArray()
    .then(data => {
      let nameList = data.map(item => item.speciesName)
      console.log(nameList);
      res.render('index.ejs', {info: nameList})
    })
    .catch(error => console.error(error))
})

app.post('/api', (req,res) => {
  console.log('Post Heard');
  db.collection('alien-info').insertOne(
    req.body
  )
  .then(result => {
    console.log(result);
    res.redirect('/')
  })
})

app.put('/updateEntry', (req,res) =>{
  console.log(req.body);
  Object.keys(req.body).forEach(key => {
    if(req.body[key] === null || req.body[key] === undefined || req.body[key] === ''){
      delete req.body[key]
    }
  })
  console.log(req.body);
  db.collection('alien-info').findOneAndUpdate(
    {name: req.body.name},
    {
      $set: req.body
    }
  )
  .then(result => {
    console.log(results);
    res.json('Success')
  })
  .catch(error => console.error(error))
})

app.delete('/deleteEntry', (req,res) =>{
  db.collection('alien-info').deleteOne(
    {name: req.body.name}
  )
  .then(result => {
    console.log('Entry Deleted');
    res.json('Entry Deleted')
  })
  .catch(error => console.error(error))
})


//SET UP LOCAL HOST ON PORT
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })