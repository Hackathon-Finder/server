const unggah = require('unggah')

const storage = unggah.s3({
    endpoint: 's3.ap-southeast-1.amazonaws.com',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: 'colabs-fp',
    rename: (req, file) => {
      return `${Date.now()}-${file.originalname}`  // this is the default
    }
  })

  module.exports = storage