const User = require('../models/user')

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp)

const expect = chai.expect

let registerData = {
    name: 'testUser',
    role: 'user',
    password: 'password',
    email: 'testUser@mail.com',
    hp: '08123456789'
}

let registerOrganizer = {
    name: 'organizer',
    role: 'organizer',
    password: 'password1',
    email: 'organizer@mail.com',
    hp: '088889888898'
}

let loginData = {
    email: registerData.email,
    password: registerData.password
}

let fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTJkNWViNzVkNzIyYjFjMGM5OWQyMzEiLCJuYW1lIjoidGVzIiwiZW1haWwiOiJ0ZXNAbWFpbC5jb20iLCJpYXQiOjE1ODAwMzE5NTd9.d6Ry9EJCgynNq3n1HHXOZFjkfynkriuAVVm2aMk9VF4'
let token
let initialUserId
let newUserId
let fakeUserId = '5e4fa2a00d99dd7e97f37be9'

before(function (done) {
    User.create({
        name: 'user1',
        role: 'user',
        password: 'secret1',
        email: 'user1@mail.com',
        hp: '081122334455'
    })
        .then(created => {
            initialUserId = created._id
            console.log('initial user created')
            done()
        })
        .catch(err => {
            console.log(err);
        })
})

after(function (done) {
    User.deleteMany({})
        .then(_ => {
            console.log('User cleared after testing');
            done()
        })
        .catch(err => {
            console.log(err);
        })
})

describe('USER ROUTES', function () {
    describe('POST /users/register', function () {
        describe('success', function () {
            it('should return object with token, user, with status code 201', function (done) {
                chai.request(app)
                    .post('/users/register')
                    .send(registerData)
                    .then(function (res) {
                        newUserId = res.body.user._id

                        expect(res).to.have.status(201)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('token')
                        expect(res.body).to.have.property('user')
                        expect(res.body.user).to.be.an('object')
                        expect(res.body.user).to.have.property('_id')
                        expect(res.body.user.summary).to.equal('')
                        expect(res.body.user.status).to.equal('available')
                        expect(res.body.user.pict).to.equal('https://picsum.photos/500')
                        expect(res.body.user.name).to.equal(registerData.name)
                        expect(res.body.user.role).to.equal(registerData.role)
                        expect(res.body.user.email).to.equal(registerData.email)
                        expect(res.body.user.hp).to.equal(registerData.hp)
                        expect(res.body.user.skillset).to.be.an('array')
                        expect(res.body.user.review).to.be.an('array')
                        expect(res.body.user.skillset.length).to.equal(0)
                        expect(res.body.user.review.length).to.equal(0)
                        expect(res.body.user.password).to.not.equal(registerData.password)

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })

        describe('error', function () {
            it('should return error with status 400 caused by empty name', function (done) {
                const withoutName = { ...registerData }
                delete withoutName.name
                chai.request(app)
                    .post('/users/register')
                    .send(withoutName)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Name is required')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by empty email', function (done) {
                const withoutEmail = { ...registerData }
                delete withoutEmail.email
                chai.request(app)
                    .post('/users/register')
                    .send(withoutEmail)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Email is required')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by empty password', function (done) {
                const withoutPassword = { ...registerData }
                delete withoutPassword.password
                chai.request(app)
                    .post('/users/register')
                    .send(withoutPassword)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Password is required')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by empty phone', function (done) {
                const withoutHp = { ...registerData }
                delete withoutHp.hp
                chai.request(app)
                    .post('/users/register')
                    .send(withoutHp)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Phone is required')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by invalid email format', function (done) {
                const invalidEmail = { ...registerData }
                invalidEmail.email = 'invalid.com'
                chai.request(app)
                    .post('/users/register')
                    .send(invalidEmail)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid email format')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by unique email validation error', function (done) {
                const emailUnique = { ...registerData }
                emailUnique.email = 'user1@mail.com'
                chai.request(app)
                    .post('/users/register')
                    .send(emailUnique)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Email already registered')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            it('should return error with status 400 caused by password min length validation error', function (done) {
                const passwordLength = { ...registerData }
                passwordLength.password = '123'
                chai.request(app)
                    .post('/users/register')
                    .send(passwordLength)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Minimum password length 6')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })
    })

    describe('POST /users/login', function () {
        describe('success', function () {
            it('should return object with token, user, with status code 200', function (done) {
                chai.request(app)
                    .post('/users/login')
                    .send(loginData)
                    .then(function (res) {

                        token = res.body.token

                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('token')
                        expect(res.body).to.have.property('user')
                        expect(res.body.user).to.be.an('object')
                        expect(res.body.user).to.have.property('_id')
                        expect(res.body.user.summary).to.equal('')
                        expect(res.body.user.status).to.equal('available')
                        expect(res.body.user.pict).to.equal('https://picsum.photos/500')
                        expect(res.body.user.name).to.equal(registerData.name)
                        expect(res.body.user.role).to.equal(registerData.role)
                        expect(res.body.user.email).to.equal(loginData.email)
                        expect(res.body.user.hp).to.equal(registerData.hp)
                        expect(res.body.user.skillset).to.be.an('array')
                        expect(res.body.user.review).to.be.an('array')
                        expect(res.body.user.skillset.length).to.equal(0)
                        expect(res.body.user.review.length).to.equal(0)
                        expect(res.body.user.password).to.not.equal(loginData.password)

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })
        describe('error', function () {
            it('should return error with status code 400 caused email not registered', function (done) {
                const wrongEmail = { ...loginData }
                wrongEmail.email = "salah@mail.com"
                chai.request(app)
                    .post('/users/login')
                    .send(wrongEmail)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors).to.equal('Wrong email/password')

                        done()
                    })
            })
            it('should return error with status code 400 caused wrong password', function (done) {
                const wrongPassword = { ...loginData }
                wrongPassword.password = "salahpass"
                chai.request(app)
                    .post('/users/login')
                    .send(wrongPassword)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors).to.equal('Wrong email/password')

                        done()
                    })
            })
        })
    })

    describe('PATCH /users/', function () {
        let updateData = {
            summary: 'summary',
            status: 'locked',
            pict: 'http://image.img',
            name: 'test update',
            hp: '08123123123',
            skillset: [{
                skill: 'javascript',
                level: 3
            }],
            review: [{
                id_user: initialUserId,
                rank: 2,
                comment: 'comment'
            }]
        }
        describe('success', function () {
            it('should return object with message with status code 200', function (done) {
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(updateData)
                    .then(function (res) {

                        expect(res).to.have.status(200)
                        expect(res.body).to.be.an('object')
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.equal('Update success')

                        done()
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })
        describe('error', function () {
            it('should return error with status code 400 caused status validation error', function (done) {
                const wrongStatus = { ...updateData }
                wrongStatus.status = "aksdjaksdjaksd"
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(wrongStatus)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid status value')

                        done()
                    })
            })
            it('should return error with status code 400 caused skillset level min validation error', function (done) {
                const wrongLevel = { ...updateData }
                wrongLevel.skillset = [{
                    skill: 'javascript',
                    level: 0
                }]
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(wrongLevel)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid skillset level value')

                        done()
                    })
            })
            it('should return error with status code 400 caused skillset level max validation error', function (done) {
                const wrongLevel = { ...updateData }
                wrongLevel.skillset = [{
                    skill: 'javascript',
                    level: 5
                }]
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(wrongLevel)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid skillset level value')

                        done()
                    })
            })
            it('should return error with status code 400 caused review rank min validation error', function (done) {
                const wrongRank = { ...updateData }
                wrongRank.review = [{
                    id_user: initialUserId,
                    rank: -1,
                    comment: 'comment'
                }]
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(wrongRank)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid review rank value')

                        done()
                    })
            })
            it('should return error with status code 400 caused review rank max validation error', function (done) {
                const wrongRank = { ...updateData }
                wrongRank.review = [{
                    id_user: initialUserId,
                    rank: 6,
                    comment: 'comment'
                }]
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(wrongRank)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Invalid review rank value')

                        done()
                    })
            })
            it('should return error with status code 400 caused empty name', function (done) {
                const emptyName = { ...updateData }
                emptyName.name = ''
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(emptyName)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Name is required')

                        done()
                    })
            })
            it('should return error with status code 400 caused empty phone', function (done) {
                const emptyHp = { ...updateData }
                emptyHp.hp = ''
                chai.request(app)
                    .patch('/users')
                    .set('token', token)
                    .send(emptyHp)
                    .then(function (res) {

                        expect(res).to.have.status(400)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(400)
                        expect(res.body.errors[0]).to.equal('Phone is required')

                        done()
                    })
            })
            it('should return error with status code 401 caused invalid token authentication', function (done) {
                chai.request(app)
                    .patch('/users')
                    .set('token', fakeToken)
                    .send(updateData)
                    .then(function (res) {
                        
                        expect(res).to.have.status(401)
                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(401)
                        expect(res.body.errors).to.equal('You need to login first')

                        done()
                    })
            })
        })
    })

    describe('GET /users', function () {
        before(function (done) {
            User.create(registerOrganizer)
                .then(_ => {
                    console.log('organizer created')
                    done()
                })
                .catch(err => {
                    console.log(err);
                })
        })
        it('should return users list array with user role with status code 200', function (done) {
            chai.request(app)
                .get('/users')
                .then(function (res) {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(2)
                    for (let obj of res.body) {
                        expect(obj).to.not.have.property('password')
                        expect(obj).to.have.property('summary')
                        expect(obj).to.have.property('status')
                        expect(obj).to.have.property('pict')
                        expect(obj).to.have.property('_id')
                        expect(obj).to.have.property('name')
                        expect(obj).to.have.property('role')
                        expect(obj).to.have.property('email')
                        expect(obj).to.have.property('hp')
                        expect(obj).to.have.property('skillset')
                        expect(obj).to.have.property('review')
                        expect(obj.role).to.equal('user')
                    }
                    done()
                })
                .catch(err => {
                    console.log(err);
                })
        })
    })

    describe('GET /users/:userId', function(){
        describe('success', function(){
            it('should return user with requested params userId with status code 200', function(done){
                chai.request(app)
                .get(`/users/${newUserId}`)
                .then(function(res){

                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.not.have.property('password')
                    expect(res.body).to.have.property('summary')
                    expect(res.body).to.have.property('status')
                    expect(res.body).to.have.property('pict')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('role')
                    expect(res.body).to.have.property('email')
                    expect(res.body).to.have.property('hp')
                    expect(res.body).to.have.property('skillset')
                    expect(res.body).to.have.property('review')
                   
                    done()
                })
                .catch(err=>{
                    console.log(err);
                })
            })
        })
        describe('error', function(){
            it('should return error with status code 404 caused req userId not found', function(done){
                chai.request(app)
                .get(`/users/${fakeUserId}`)
                .then(function(res){
                    expect(res).to.have.status(404)

                        expect(res.body).to.be.an('object')
                        expect(res.body.code).to.equal(404)
                        expect(res.body.errors).to.equal('User not found')

                    done()
                })
                .catch(err=>{
                    console.log(err);
                })
            })
        })
    })
    describe('POST /users/skill', function(){
        before(function (done) {
            let skillset = [{
                skill: 'javascript',
                level: 2
            },{
                skill: 'python',
                level: 3
            }]
            User.findByIdAndUpdate(initialUserId, {
                skillset
            }, { omitUndefined: true, runValidators: true })
                .then(_ => {
                    console.log('Initial user skillset updated')
                    done()
                })
                .catch(err => {
                    console.log(err);
                })
        })
        it('should return users list array with req body skillset requirement with status code 200', function(done){
            chai.request(app)
            .post('/users/skill')
            .send({
                skillset: [{
                    skill: 'javascript',
                    level: 2
                },{
                    skill: 'python',
                    level: 1
                }]
            })
            .then(function(res){
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                expect(res.body.length).to.equal(2)
                for (let obj of res.body) {
                    expect(obj).to.not.have.property('password')
                    expect(obj).to.have.property('summary')
                    expect(obj).to.have.property('status')
                    expect(obj).to.have.property('pict')
                    expect(obj).to.have.property('_id')
                    expect(obj).to.have.property('name')
                    expect(obj).to.have.property('role')
                    expect(obj).to.have.property('email')
                    expect(obj).to.have.property('hp')
                    expect(obj).to.have.property('skillset')
                    expect(obj).to.have.property('review')
                }

                done()
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
})