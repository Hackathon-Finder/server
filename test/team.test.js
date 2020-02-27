
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
chai.use(chaiHttp)
const expect = chai.expect
const { User,Event,Team } = require('../models/index')
var ownerid = ''
var eventid = ''
var memberid = ''
var token=null
let fakeid = '5e4fa2a00d99dd7e97f37be9'
let fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTJkNWViNzVkNzIyYjFjMGM5OWQyMzEiLCJuYW1lIjoidGVzIiwiZW1haWwiOiJ0ZXNAbWFpbC5jb20iLCJpYXQiOjE1ODAwMzE5NTd9.d6Ry9EJCgynNq3n1HHXOZFjkfynkriuAVVm2aMk9VF4'
let fakeToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTUwOTRhOTY5OTk5ZTBiNGRlMzYxZmUiLCJpYXQiOjE1ODIzMzkyNDJ9.T97L1-x-6GUz5UhC46rgUaFvP408OGizBEDRVAHRYYc'

after(function(){
    return User.deleteMany({})
    .then(()=>{
        return Event.deleteMany({})
    })
    .then(()=>{
        return Team.deleteMany({})
    })
    .then(()=>{
    })
    .catch(err=>{
        console.log(err)
    })
})
before(function(){
    return User.create({
        organization: '',
        role: 'user',
        email: 'serafim@mail.com',
        password: 'secret',
        name: 'sera',
        hp: "087855727464",
        skillset: [{
            skill: 'JavaScript',
            level: 4
        }],
        status: 'available',
        summary: 'aku sangat hebat',
        pict: 'https://picsum.photos/500',
        review:[]
    })
    .then(result=>{
        ownerid = result._id
        return Event.create({
            title:'hackathon',
            summary:'sebuah lomba untuk developer',
            status: 'open',
            max_size: 2,
            teams:[],
            applicants:[],
            ownerId: ownerid,
            pictures:'https://picsum.photos/500',
            date: ['2020-01-01','2020-01-02']
        })
    })
    .then(result=>{
        eventid = result._id
        return User.create({
            organization: '',
            role: 'user',
            password: 'kenny1',
            name: 'kenny',
            email: 'kenny@mail.com',
            hp: 087855727466,
            skillset: [{
                skill: 'JavaScript',
                level: 4
            }],
            status: 'available',
            summary: 'aku sangat hebat',
            pict: 'https://picsum.photos/500',
            review:[]
        })
    })
    .then(result=>{
        memberid = result._id
    })
    .catch(err=>{
        console.log(err)
    })
})

describe("Team's CRUD", function(){
    let teamid=null
    before(function(done){
        chai.request(app)
        .post('/users/login')
        .send({
            email: 'serafim@mail.com',
            password: 'secret',
        })
        .then(function(res){
            token = res.body.token
            done()
        })
        .catch(err=>{
            console.log(err)
        })
    })
    describe("/POST Create Team Success", function(){
        it('should send an object with status code 201',function(done){
            chai
                .request(app)
                .post('/teams')
                .set('token', token)
                .send({
                    name: 'team',
                    max_size: 4,
                    skillset: [{
                        skill: 'JavaScript', 
                        level: 3
                    },{
                        skill: 'React Native', 
                        level: 2
                    }],
                    eventId: eventid
                })
                .then(function(res){
                    teamid = res.body._id
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('ownerId')
                    expect(res.body).to.have.property('max_size')
                    expect(res.body).to.have.property('skillset')
                    expect(res.body).to.have.property('team_size')
                    expect(res.body).to.have.property('members')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('status')
                    expect(res.body).to.have.property('eventId')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 empty event id',function(done){
            chai
                .request(app)
                .post('/teams')
                .set('token', token)
                .send({
                    name: 'team',
                    max_size: 4,
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors[0]).to.equal('Event id is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 caused by empty max_size',function(done){
            chai
                .request(app)
                .post('/teams')
                .set('token', token)
                .send({
                    name: 'team',
                    skillset: [{
                        skill: 'JavaScript', 
                        level: 3
                    },{
                        skill: 'React Native', 
                        level: 2
                    }],
                    eventId: eventid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors[0]).to.equal('Maximum team size is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 caused by empty name',function(done){
            chai
                .request(app)
                .post('/teams')
                .set('token', token)
                .send({
                    max_size: 4,
                    skillset: [{
                        skill: 'JavaScript', 
                        level: 3
                    },{
                        skill: 'React Native', 
                        level: 2
                    }],
                    eventId: eventid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors[0]).to.equal('Team name is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET get all teams", function(){
        it('should send an array with status code 200', function(done){
            chai
                .request(app)
                .get('/teams')
                .set('token', token)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.have.property('_id')
                    expect(res.body[0]).to.have.property('name')
                    expect(res.body[0]).to.have.property('ownerId')
                    expect(res.body[0]).to.have.property('max_size')
                    expect(res.body[0]).to.have.property('skillset')
                    expect(res.body[0]).to.have.property('team_size')
                    expect(res.body[0]).to.have.property('members')
                    expect(res.body[0]).to.have.property('applicants')
                    expect(res.body[0]).to.have.property('status')
                    expect(res.body[0]).to.have.property('eventId')
                    done()
                })
        })
        it("should get an error with status code 401 Authentication error", function(done){
            chai
                .request(app)
                .get('/teams')
                .set('token', fakeToken)
                .then(function(res){
                    expect(res.body).to.be.an('object')
                    expect(res.body.code).to.equal(401)
                    expect(res.body.errors).to.equal('You need to login first')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        
    })
    describe("/GET get one team", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .get('/teams/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('ownerId')
                    expect(res.body).to.have.property('max_size')
                    expect(res.body).to.have.property('skillset')
                    expect(res.body).to.have.property('team_size')
                    expect(res.body).to.have.property('members')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('status')
                    expect(res.body).to.have.property('eventId')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should send an error with status code 400 No events found", function(done){
            chai
                .request(app)
                .get('/teams/'+fakeid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Team not found')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET all teams by owner Id", function(){
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .get('/teams/owner')
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(1)
                    expect(String(res.body[0].ownerId._id)).to.equal(String(ownerid))
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status code 401 Token Error", function(done){
            chai
                .request(app)
                .get('/teams/owner')
                .set('token', fakeToken)
                .then(function(res){
                    expect(res).to.have.status(401)
                    expect(res.body.code).to.equal(401)
                    expect(res.body.errors).to.equal('You need to login first')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/update/'+teamid)
                .set('token', token)
                .send({
                    name: 'name update',
                    max_size: 10,
                    skillset: [{
                        skill: 'Python',
                        level: 4
                    }]
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(res.body.name).to.equal('name update')
                    expect(res.body.max_size).to.equal(10)
                    expect(res.body.skillset[0].skill).to.equal('Python')
                    expect(res.body.skillset[0].level).to.equal(4)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 Team not found', function(done){
            chai
                .request(app)
                .patch('/teams/update/'+fakeid)
                .set('token', token)
                .send({
                    name: 'name update',
                    max_size: 10,
                    skillset: [{
                        skill: 'Python',
                        level: 4
                    }]
                })
                .then(res=>{
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal("Team not found")
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/update/'+teamid)
                .set('token', token)
                .send({
                    name: undefined,
                    max_size: 5,
                    skillset: undefined
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(res.body.name).to.equal('name update')
                    expect(res.body.max_size).to.equal(5)
                    expect(res.body.skillset[0].skill).to.equal('Python')
                    expect(res.body.skillset[0].level).to.equal(4)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should get an error with status code 403 Not Authorized", function(done){
            chai
                .request(app)
                .patch('/teams/update/'+teamid)
                .set('token', fakeToken2)
                .send({
                    name: 'name update',
                    max_size: 10,
                    skillset: [{
                        skill: 'Python',
                        level: 4
                    }]
                })
                .then(res=>{
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team status", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/status/'+teamid)
                .set('token', token)
                .send({
                    status: 'locked'
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(res.body.status).to.equal('locked')
                    expect(res.body.name).to.equal('name update')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should get an error with status code 403 Not Authorized", function(done){
            chai
                .request(app)
                .patch('/teams/status/'+teamid)
                .set('token', fakeToken2)
                .send({
                    status: 'locked'
                })
                .then(res=>{
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team add an applicant", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/addapplicant/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(String(res.body.applicants[0]._id)).to.equal(String(ownerid))
                    expect(res.body.members.length).to.equal(0)
                    expect(res.body.applicants.length).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400', function(done){
            chai
                .request(app)
                .patch('/teams/addapplicant/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('User already added to applicants')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET get all teams where the User is an applicant", function(){
        it("should send an array with status code 200", function(done){
            chai
                .request(app)
                .get('/teams/applicant/'+ownerid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(1)
                    expect(String(res.body[0]._id)).to.equal(String(teamid))
                    expect(String(res.body[0].applicants[0]._id)).to.equal(String(ownerid))
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team add a member", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/addmember/'+teamid)
                .set('token', token)
                .send({
                    userId: ownerid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(String(res.body.members[0]._id)).to.equal(String(ownerid))
                    expect(res.body.members.length).to.equal(1)
                    expect(res.body.applicants.length).to.equal(0)
                    expect(res.body.team_size).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 Team already added to members', function(done){
            chai
                .request(app)
                .patch('/teams/addmember/'+teamid)
                .set('token', token)
                .send({
                    userId: ownerid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('User already added to members')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 403', function(done){
            chai
                .request(app)
                .patch('/teams/addmember/'+teamid)
                .set('token', fakeToken2)
                .send({
                    userId: ownerid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET get all teams where the User is member", function(){
        it("should send an array with status code 200", function(done){
            chai
                .request(app)
                .get('/teams/member/'+ownerid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(1)
                    expect(String(res.body[0]._id)).to.equal(String(teamid))
                    expect(String(res.body[0].members[0]._id)).to.equal(String(ownerid))
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team remove a member", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/removemember/'+teamid)
                .set('token', token)
                .send({
                    userId: ownerid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(String(res.body.applicants[0]._id)).to.equal(String(ownerid))
                    expect(res.body.members.length).to.equal(0)
                    expect(res.body.members[0]).to.not.equal(null)
                    expect(res.body.applicants.length).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400', function(done){
            chai
                .request(app)
                .patch('/teams/removemember/'+teamid)
                .set('token', token)
                .send({
                    userId: memberid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('User already removed from members')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 403', function(done){
            chai
                .request(app)
                .patch('/teams/removemember/'+teamid)
                .set('token', fakeToken2)
                .send({
                    userId: memberid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update team remove an applicant", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/removeapplicant/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(res.body.members.length).to.equal(0)
                    expect(res.body.applicants.length).to.equal(0)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an error with status code 400 user already removed from applicants', function(done){
            chai
                .request(app)
                .patch('/teams/removeapplicant/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('User already removed from applicants')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/DELETE delete team Success", function(){
        it('should send an error with status code 403', function(done){
            chai
                .request(app)
                .delete('/teams/'+teamid)
                .set('token', fakeToken2)
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .delete('/teams/'+teamid)
                .set('token', token)
                .then(res=>{
                    expect(res).to.have.status(200)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
})
