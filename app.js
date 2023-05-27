const express = require('express')
const path = require('path')
const predictHandler = require('./predictHandler');

const app = express();
app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res)=> {
  res.sendFile(path.join(__dirname,'public/index.html'))
})

app.get('/hello', (req, res) => [
  res.send({
    "message": "hello world"
  })
])

app.post('/detect', predictHandler)

const port = process.env.PORT || 8080;
app.listen(port, ()=>{
  console.log(`running on port ${port}`);
})