
const mongoose = require('mongoose')

let mongoUri
if(process.env.NODE_ENV === 'testing'){
  mongoUri = process.env.MONGO_URI_TESTING
}
else {
  mongoUri = process.env.MONGO_URI
}

const mongoConfig = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

mongoose.connect(mongoUri, mongoConfig, function (err) {
  err ? console.log("db disconnected") : console.log("db connected")
})