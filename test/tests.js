// Define Test port
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const { expect } = chai;
chai.use(chaiHttp);
// eslint-disable-next-line no-undef
describe('Team Work API Server!', () => {
  // eslint-disable-next-line no-undef
  it('welcomes user to the api', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body.message).to.equals('Welcome To Testing API');
        done();
      });
  });
});
