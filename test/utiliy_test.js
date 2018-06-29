var should = require('chai').should(),
        expect = require('chai').expect(),
        supertest = require('supertest'),
        api = supertest('http://localhost:3000/api/example/');

describe('users', function () {
    it('Should return a 200 respose', function (done) {
        //use this.timeout(6000); to set timeout in miliseconds, default value for the timeout is 2000 miliseconds
        api.get('users')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done);
    });
});

describe('users', function () {
   it('Should return a 200 respose with passing parameter like name & place', function (done) {
       api.post('users')
            .send({"name":"ajay","place":"Delhi"})
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done);
   });
});

describe('users/1', function () {
    it('Should return a 200 respose', function (done) {
        api.get('users/1')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done);
    });
});

describe('users/100', function () {
   it('Should return a 404 respose because no user availabe invalid userId', function (done) {
       api.get('users/100')
           .expect('Content-Type', 'application/json; charset=utf-8')
           .expect(404, done);
   });
});

describe('users', function () {
   it('Should return a 422 respose because no parameter is pass like name & place', function (done) {
       api.post('users')
           .expect('Content-Type', 'application/json; charset=utf-8')
           .expect(422, done);
   });
});
