
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const expect = chai.expect
const app = require('../app')
const { Team, Event, User} = require('../models/index')
var ownerid = null
var teamid = null
var eventid = null
var token = null
var teamOwnerId = null

after(function(){
    return User.deleteMany({})
    .then(()=>{
        console.log('users cleaned up')
        // done()
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
        password: 'secret',
        name: 'bram',
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
            name: 'nuel',
            email: 'nuel@mail.com',
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
    describe("/POST create an event", function(){
        it("should return an object with status code 201", function(done){
            chai
                .request(app)
                .post('/events')
                .set('token', token)
                .send({
                    title:'Hacktiv8',
                    summary:'lomba ngoding yang sangat seru',
                    team_size: 2,
                    ownerId: ownerid,
                    date:[new Date(), new Date()]
                })
                .then(function(res){
                    eventid = res.body._id
                    expect(res).to.have.status(201)
                    // console.log(res.body)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('title')
                    expect(res.body).to.have.property('summary')
                    expect(res.body).to.have.property('team_size')
                    expect(res.body).to.have.property('ownerId')
                    expect(res.body).to.have.property('date')
                    expect(res.body).to.have.property('status')
                    expect(res.body).to.have.property('teams')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
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
                    expect(res.body[0]).to.have.property('team_size')
                    expect(res.body[0]).to.have.property('ownerId')
                    expect(res.body[0]).to.have.property('date')
                    expect(res.body[0]).to.have.property('status')
                    expect(res.body[0]).to.have.property('teams')
                    expect(res.body[0]).to.have.property('applicants')
                    expect(res.body[0]).to.have.property('pictures')
                    expect(res.body.length).to.equal(2)
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
                    expect(res.body.team_size).to.equal(2)
                    expect(res.body.ownerId).to.equal(String(ownerid))
                    expect(res.body).to.have.property('date')
                    expect(res.body.status).to.equal('start')
                    expect(res.body).to.have.property('teams')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
                    done()
                })
                .catch(err=>{
                    console.log(err)
                })
        })
    })
    describe("/PUT update event", function(){
        it("should return an object with status code 200", function(done){
            chai
                .request(app)
                .put('/events/update/'+eventid)
                .set('token', token)
                .send({
                    title:'Loyal-Fox',
                    summary:'lomba ngoding yang lumayan seru',
                    team_size: 4,
                    date:[new Date(), new Date()]
                })
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body._id).to.equal(eventid)
                    expect(res.body.title).to.equal('Loyal-Fox')
                    expect(res.body.summary).to.equal('lomba ngoding yang lumayan seru')
                    expect(res.body.team_size).to.equal(4)
                    expect(res.body.ownerId).to.equal(String(ownerid))
                    expect(res.body).to.have.property('date')
                    expect(res.body.status).to.equal('start')
                    expect(res.body).to.have.property('teams')
                    expect(res.body).to.have.property('applicants')
                    expect(res.body).to.have.property('pictures')
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
                team_size: 0,
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
        //tambahin yang add applicants route
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
    })
    describe("/DELETE Delete Event", function(){
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