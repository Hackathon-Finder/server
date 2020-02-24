const unggah = require('unggah')
const storage = require('../config/aws')

const upload = unggah({
    limits: {
      fileSize: 1e6 // in bytes
    },
    storage: storage
  })

  module.exports = upload