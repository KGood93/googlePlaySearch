const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return request(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const game = res.body[0];
                expect(game).to.include.keys('App', 'Category', 'Rating', 'Reviews', 'Type');
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'MISTAKE'})
            .expect(400, 'Sort must be one of App or Rating');
    });

    it('should sort by App', () => {
        return request(app)
            .get('/apps')
            .query({aort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length -1) {
                    sorted = sorted && res.body[i].title < res.body[i + 1].title;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
});