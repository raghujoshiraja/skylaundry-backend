const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 4040
const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING

app = express()

mongoose.connect(MONGO_CONN_STRING, {
  // Configs to prevent warnings. IDK what they do
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
mongoose.connection.once('open', () => console.log("MongoDB Connected!"))

app.use(require('./routes/userRouter'))
app.get('/', (req, res) => res.json({message: "Hey! The backend is working. Explore routes from the code"}))

app.listen(PORT, () => console.info(`Started listening on PORT ${PORT}`))
//This is learning