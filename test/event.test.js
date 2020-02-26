
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')
const { Team, Event, User} = require('../models/index')
let ownerid,teamid,eventid,token,teamOwnerId
let fakeid = '5e4fa2a00d99dd7e97f37be9'
let fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTJkNWViNzVkNzIyYjFjMGM5OWQyMzEiLCJuYW1lIjoidGVzIiwiZW1haWwiOiJ0ZXNAbWFpbC5jb20iLCJpYXQiOjE1ODAwMzE5NTd9.d6Ry9EJCgynNq3n1HHXOZFjkfynkriuAVVm2aMk9VF4'
let fakeToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTUwOTRhOTY5OTk5ZTBiNGRlMzYxZmUiLCJpYXQiOjE1ODIzMzkyNDJ9.T97L1-x-6GUz5UhC46rgUaFvP408OGizBEDRVAHRYYc'

after(function(){
    return User.deleteMany({})
    .then(()=>{
        console.log('users cleaned up')
        return Event.deleteMany({})
    })
    .then(()=>{
        console.log('event cleaned up')
        return Team.deleteMany({})
    })
    .then(()=>{
        console.log('team cleaned up')
    })
    .catch(err=>{
        console.log(err)
        // done()
    })
})
before(function(){
    return User.create({
        organization: 'Hacktiv8',
        role: 'organizer',
        name: 'bram',
        password: 'secret',
        email: 'bram@mail.com',
        hp: "087855727464",
        skillset: [],
        status: 'available',
        summary: 'aku sangat hebat',
        pict: 'https://picsum.photos/500',
        review:[]
    })
    .then(result=>{
        ownerid = result._id
        return User.create({
            organization: '',
            role: 'user',
            password: 'secret',
            email: 'nuel@mail.com',
            name: 'nuel',
            hp: "087855727466",
            skillset: [],
            status: 'available',
            summary: 'aku sangat hebat',
            pict: 'https://picsum.photos/500',
            review:[]
        })
    })
    .then(result=>{
        teamOwnerId = result._id
    })
    .catch(err=>{
        console.log(err)
    })
})

describe("Event CRUD", function(){
    // inital login
    before(function(done){
        chai.request(app)
        .post('/users/login')
        .send({
            password: 'secret',
            email: 'bram@mail.com',
        })
        .then(function(res){
            token = res.body.token
            return chai.request(app)
            .patch('/users')
            .set('token', token)
            .send({
                subscribe: 'subscribe'
            })
        })
        .then(function(res){
            done()
        })
        .catch(err=>{
            console.log(err)
        })
    })
    describe("/POST create an event", function(){
        it("should return an object with status code 201", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'Hacktiv8',
                    summary:'lomba ngoding yang sangat seru',
                    max_size: 2,
                    pictures:'https://picsum.photos/500',
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    eventid = res.body._id
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('title')
                    expect(res.body).to.have.property('summary')
                    expect(res.body).to.have.property('max_size')
                    expect(res.body.max_size).to.equal(2)
                    expect(res.body).to.have.property('ownerId')
                    expect(res.body).to.have.property('date')
                    expect(res.body).to.have.property('status')
                    expect(res.body.status).to.equal('open')
                    expect(res.body).to.have.property('teams')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body.teams).to.be.an('array')
                    expect(res.body.applicants).to.be.an('array')
                    expect(res.body).to.have.property('pictures')
                    expect(res.body.date.length).to.equal(2)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by empty title", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'',
                    summary:'lomba ngoding yang sangat seru',
                    max_size: 2,
                    pictures:'https://picsum.photos/500',
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Event title is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by empty summary", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'title',
                    summary:'',
                    pictures:'https://picsum.photos/500',
                    max_size: 2,
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Event summary is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by empty max_size", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'title',
                    pictures:'https://picsum.photos/500',
                    summary:'apapunlah',
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Max size is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by validation error min max_size", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'title',
                    max_size: 0,
                    summary:'apapunlah',
                    pictures:'https://picsum.photos/500',
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Minimum one team member')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by validation error min date array length", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'title',
                    max_size: 2,
                    summary:'apapunlah',
                    pictures:'https://picsum.photos/500',
                    date:'2020-01-01'
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Date must consist of start date and end date')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 400 caused by empty pictures", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'title',
                    max_size: 2,
                    summary:'apapunlah',
                    date: '2020-01-01,2020-01-02',
                    pictures: null
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.be.an('array')
                    expect(res.body.errors[0]).to.equal('Event picture is required')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error object with status code 401 caused by authentication error", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', fakeToken)
                .send({
                    title:'title',
                    max_size: 2,
                    pictures:'https://picsum.photos/500',
                    summary:'apapunlah',
                    date: '2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('code')
                    expect(res.body).to.have.property('errors')
                    expect(res.body.code).to.equal(401)
                    expect(res.body.errors).to.equal('You need to login first')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET find all events", function(){
        it("should return an array with status code 200", function(done){
            chai
                .request(app)
                .get('/events')
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.have.property('_id')
                    expect(res.body[0]).to.have.property('title')
                    expect(res.body[0]).to.have.property('summary')
                    expect(res.body[0]).to.have.property('max_size')
                    expect(res.body[0]).to.have.property('ownerId')
                    expect(res.body[0]).to.have.property('date')
                    expect(res.body[0]).to.have.property('status')
                    expect(res.body[0]).to.have.property('teams')
                    expect(res.body[0]).to.have.property('applicants')
                    expect(res.body[0]).to.have.property('pictures')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 401", function(done){
            chai
                .request(app)
                .get('/events')
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
    describe("/GET find one event", function(){
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .get('/events/'+eventid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body._id).to.equal(eventid)
                    expect(res.body.title).to.equal('Hacktiv8')
                    expect(res.body.summary).to.equal('lomba ngoding yang sangat seru')
                    expect(res.body.max_size).to.equal(2)
                    expect(res.body).to.have.property('date')
                    expect(res.body.status).to.equal('open')
                    expect(res.body).to.have.property('teams')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 400 Event not found", function(done){
            chai
                .request(app)
                .get('/events/'+fakeid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Event not found')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/GET all events by owner", function(){
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .get('/events/owner')
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
        it("should return an error with status code 400 Token Error", function(done){
            chai
                .request(app)
                .get('/events/owner')
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
    describe("/PATCH update event", function(){
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .patch('/events/update/'+eventid)
                .set('token', token)
                .send({
                    title:'Loyal-Fox',
                    summary:'lomba ngoding yang lumayan seru',
                    max_size: 4,
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body._id).to.equal(eventid)
                    expect(res.body.title).to.equal('Loyal-Fox')
                    expect(res.body.summary).to.equal('lomba ngoding yang lumayan seru')
                    expect(res.body.max_size).to.equal(4)
                    expect(res.body).to.have.property('date')
                    expect(res.body.status).to.equal('open')
                    expect(res.body).to.have.property('teams')
                    expect(res.body.teams).to.be.an('array')
                    expect(res.body.applicants).to.be.an('array')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an object with status code 200 with max_size undefined", function(done){
            chai
                .request(app)
                .patch('/events/update/'+eventid)
                .set('token', token)
                .send({
                    title:'Loyal',
                    summary:undefined,
                    max_size: undefined,
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body._id).to.equal(eventid)
                    expect(res.body.title).to.equal('Loyal')
                    expect(res.body.summary).to.equal('lomba ngoding yang lumayan seru')
                    expect(res.body.max_size).to.equal(4)
                    expect(res.body).to.have.property('date')
                    expect(res.body.status).to.equal('open')
                    expect(res.body).to.have.property('teams')
                    expect(res.body.teams).to.be.an('array')
                    expect(res.body.applicants).to.be.an('array')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 403 Not Authorized", function(done){
            chai
                .request(app)
                .patch('/events/update/'+eventid)
                .set('token', fakeToken2)
                .send({
                    title:'Loyal-Fox',
                    summary:'lomba ngoding yang lumayan seru',
                    max_size: 4,
                    date:'2020-01-01,2020-01-02'
                })
                .then(function(res){
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 400", function(done){
            chai
                .request(app)
                .patch('/events/update/'+fakeid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Event not found')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 401 User Not logged in", function(done){
            chai
                .request(app)
                .patch('/events/update/'+eventid)
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
    describe("/PATCH update event's teams and applicants", function(){
        before(function(){
            return Team.create({
                name: 'team',
                ownerId: teamOwnerId,
                max_size: 4,
                max_size: 0,
                members:[],
                applicants:[],
                skillset: [{
                    skill: 'JavaScript', 
                    level: 2
                }],
                status: 'open',
                eventId: eventid
            })
            .then(result=>{
                teamid = result._id
            })
            .catch(err=>{
                console.log(err)
            })
        })
        it("add to applicants should return an object with status code 200", function(done){
            chai
                .request(app)
                .patch('/events/addapplicants/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.teams.length).to.equal(0)
                    expect(res.body.data.applicants.length).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("add to applicants should return an error with status code 400", function(done){
            chai
                .request(app)
                .patch('/events/addapplicants/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Team already added to applicants')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("add to applicants should return an error with status code 401", function(done){
            chai
                .request(app)
                .patch('/events/addapplicants/'+eventid)
                .set('token', fakeToken)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(401)
                    expect(res.body).to.be.an('object')
                    expect(res.body.code).to.equal(401)
                    expect(res.body.errors).to.equal('You need to login first')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("add to teams should return an object with status code 200", function(done){
            chai
                .request(app)
                .patch('/events/addteam/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.teams.length).to.equal(1)
                    expect(res.body.data.applicants.length).to.equal(0)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 403 Not Authorized to add team", function(done){
            chai
                .request(app)
                .patch('/events/addteam/'+eventid)
                .set('token', fakeToken2)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("add to teams should return an error with status code 400", function(done){
            chai
                .request(app)
                .patch('/events/addteam/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Team already added')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("remove from teams should return an object with status code 200", function(done){
            chai
                .request(app)
                .patch('/events/removeteam/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.teams.length).to.equal(0)
                    expect(res.body.data.applicants.length).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 403 Not Authorized to remove team", function(done){
            chai
                .request(app)
                .patch('/events/removeteam/'+eventid)
                .set('token', fakeToken2)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("remove from teams should return an error with status code 400 Team already removed from teams", function(done){
            chai
                .request(app)
                .patch('/events/removeteam/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('team already removed from event')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("remove from applicants should return an object with status code 200", function(done){
            chai
                .request(app)
                .patch('/events/removeapplicants/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data.teams.length).to.equal(0)
                    expect(res.body.data.applicants.length).to.equal(0)
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("remove from applicants should return an error with status code 400 Team already removed from applicants", function(done){
            chai
                .request(app)
                .patch('/events/removeapplicants/'+eventid)
                .set('token', token)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(400)
                    expect(res.body).to.be.an('object')
                    expect(res.body.code).to.equal(400)
                    expect(res.body.errors).to.equal('Team already removed from applicants')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PATCH update event status", function(){
        it('should return an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/events/updatestatus/'+eventid)
                .set('token', token)
                .send({
                    status: 'open'
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body.status).to.equal('open')
                    expect(res.body.title).to.equal('Loyal')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an error with status 403 Not Authorized to update event status", function(done){
            chai
                .request(app)
                .patch('/events/updatestatus/'+eventid)
                .set('token', fakeToken2)
                .send({
                    teamId: teamid
                })
                .then(function(res){
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
    describe("/DELETE Delete Event", function(){
        it("should return an error with status 403 Not Authorized to delete event", function(done){
            chai
                .request(app)
                .delete('/events/delete/'+eventid)
                .set('token', fakeToken2)
                .send({
                    teamId: teamid
                })
                .then(function(res){
                    expect(res).to.have.status(403)
                    expect(res.body.code).to.equal(403)
                    expect(res.body.errors).to.equal('Not Authorized')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .delete('/events/delete/'+eventid)
                .set('token', token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body.message).to.equal('Event successfuly deleted')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
})