
const bcrypt = require('bcryptjs')

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

function checkPassword(passwordInput, passwordDb) {
  return bcrypt.compareSync(passwordInput, passwordDb)
}

module.exports = { hashPassword, checkPassword }