
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

after(function(){
    return User.deleteMany({})
    .then(()=>{
        console.log('cleaned up')
        // done()
        return Event.deleteMany({})
    })
    .then(()=>{
        console.log('event cleaned up')
        return Team.deleteMany({})
    })
    .then(()=>{
        console.log('Team cleaned up')
    })
    .catch(err=>{
        console.log(err)
        // done()
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
            status: 'start',
            team_size: 2,
            teams:[],
            applicants:[],
            ownerId: ownerid,
            pictures:['https://picsum.photos/500'],
            date:[new Date(), new Date()]
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
    describe("/POST Create Team Success", function(){
        it('should send an object with status code 201',function(done){
            chai
                .request(app)
                .post('/teams')
                .set('token', token)
                .send({
                    name: 'team',
                    ownerId: ownerid,
                    max_size: 4,
                    // team_size:Number,
                    // members:[{type: Schema.Types.ObjectId, ref: 'User'}],
                    // applicants:[{type: Schema.Types.ObjectId, ref: 'User'}],
                    skillset: [{
                        skill: 'JavaScript', 
                        level: 3
                    },{
                        skill: 'React Native', 
                        level: 2
                    }],
                    // status: {
                    //     required: [true, 'Team status is required'],
                    //     type: String,
                    //     enum: ['open', 'locked'],
                    //     default: 'open'
                    // },
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
    })
    describe("/GET get all teams Success", function(){
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
    })
    describe("/GET get one team Success", function(){
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
    })
    describe("/PUT update team Success", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .put('/teams/update/'+teamid)
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
                    // console.log(res,'===')
                    done()
                })
                .catch(err=>{
                    console.log('error update team', err)
                })
        })
    })
    describe("/PATCH update team status Success", function(){
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
                    console.log('error update team', err)
                })
        })
    })
    describe("/PATCH update team add a member Success", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/addmember/'+teamid)
                .set('token', token)
                .send({
                    userId: memberid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(String(res.body.members[0])).to.equal(String(memberid))
                    expect(res.body.members.length).to.equal(1)
                    expect(res.body.applicants.length).to.equal(0)
                    done()
                })
                .catch(err=>{
                    console.log('error update team', err)
                })
        })
    })
    describe("/PATCH update team remove a member Success", function(){
        it('should send an object with status code 200', function(done){
            chai
                .request(app)
                .patch('/teams/removemember/'+teamid)
                .set('token', token)
                .send({
                    userId: memberid
                })
                .then(res=>{
                    expect(res.body).to.be.an('object')
                    expect(res).to.have.status(200)
                    expect(String(res.body.applicants[0])).to.equal(String(memberid))
                    expect(res.body.members.length).to.equal(0)
                    expect(res.body.applicants.length).to.equal(1)
                    done()
                })
                .catch(err=>{
                    console.log('error update team', err)
                })
        })
    })
    describe("/DELETE delete team Success", function(){
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
                    console.log('error update team', err)
                })
        })
    })
})
