// Define Test port
require('dotenv').config();

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const testDb = require('../testdb');

const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU3MzQzNzgwMiwiZXhwIjoxNTgyMDc3ODAyLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0MzAwMCJ9.cPYVue_PJsk27kgsVbQpCU6BlvwiJzonTayRp-69RpU';
const employeeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTU3MzQzNzk5NywiZXhwIjoxNTgyMDc3OTk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0MzAwMCJ9.hi90k1_37qA4kADXVrW1OT281WetpoWk-aOETaNKTD0';
const { expect } = chai;
chai.use(chaiHttp);


describe('Tests for the Teamwork RestFul API!', () => {
  after((done) => {
    testDb.deleteTestUsers();
    done();
  });
  describe('Test that the admin can create employes on using the post route - /api/v1/auth/create-user', () => {

    // Include Tests for authorization token
    it('Should not  allow a user without the bearer token to create a user', (done) => {
      const user = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'unittest@employee.com',
        password: '12345678',
        gender: 'Male',
        jobRole: 'Talent Manager',
        department: 'A & R',
        role: 'test',
        address: 'Lagos',
      };
      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equals('Authentication error. Token required.');
          done();
        });
    });
    it('Should not  allow anyone who is not an admin to create a user', (done) => {
      const user = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'unittest@employee.com',
        password: '12345678',
        gender: 'Male',
        jobRole: 'Talent Manager',
        department: 'A & R',
        address: 'Lagos',
      };
      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equals('This Route is reserved for Admin Users Only.');
          done();
        });
    });
    // Include Tests that its only admin
    it('Allows an admin create an Employee with the right credentials', (done) => {
      const user = {
        firstName: 'Test',
        lastName: 'Employee',
        email: 'unittest@employee.com',
        password: '12345678',
        gender: 'Male',
        jobRole: 'RegTester',
        department: 'A & R',
        address: 'Lagos',
      };
      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.equals('success');
          done();
        });
    });
    it('Should not allow an admin create another Employee with the same email as existing employee', (done) => {
      const user = {
        firstName: 'Test 2',
        lastName: 'Employee',
        email: 'unittest@employee.com',
        password: '12345678',
        gender: 'Female',
        jobRole: 'Producer',
        department: 'Media',
        address: 'Lagos',
      };
      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('User with that EMAIL already exist');
          done();
        });
    });
    it('Should not create a user without any of these: firstname, lastname, email, password and department ', (done) => {
      const user = {
        firstName: '',
        lastName: 'Solomon',
        email: 'solomon@employee.com',
        password: '123456',
        gender: 'mail',
        jobRole: 'cashier',
        department: '',
        address: 'Lagos',
      };

      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('The following fields are required before employee can be registered: firstname, lastname, email, password and department');
          done();
        });
    });
    it('Should not create a user without a valid emial', (done) => {
      const user = {
        firstName: 'Mark',
        lastName: 's',
        email: 'mail.com',
        password: '123456',
        gender: 'mail',
        jobRole: 'cashier',
        department: 'Office Management',
        address: 'Lagos',
      };
      chai
        .request(app)
        .post('/api/v1/auth/create-user')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('Please enter a valid email');
          done();
        });
    });
  });
/*  describe('Test that employees can sign in with the credentials admin provides to them', () => {
    it('Should not allow an employee sign in without entering thier password ', (done) => {
      const user = {
        email: 'unittest@employee.com',
        password: '',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('Kindly enter your email and password to login');
          done();
        });
    });
    it('Should not allow an employee sign in without entering thier email ', (done) => {
      const user = {
        email: '',
        password: '123456',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('Kindly enter your email and password to login');
          done();
        });
    });
    it('Should not allow an employee sign in with the wrong password', (done) => {
      const user = {
        email: 'unittest@employee.com',
        password: '1235678',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('Invalid Credentials');
          done();
        });
    });
    it('Should not allow an employee sign in with an invalid email', (done) => {
      const user = {
        email: 'employee.com',
        password: '1235678',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equals('error');
          expect(res.body.error).to.equals('Please enter a valid email');
          done();
        });
    });
    it('Should allow an employee sign in succesfully with the right credentials', (done) => {
      const user = {
        email: 'unittest@employee.com',
        password: '12345678',
      };
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.equals('success');
          done();
        });
    });
  });
  describe('Test that signed in employees can create articles on the system', () => {
    it('Should not allow anyone one who is not signed in to create an article', (done) => {
      const article = {
        title: 'The Great sails',
        article: 'The Age of Sail (usually dated as 1571–1862) was a period roughly corresponding to the early modern period in which international trade and naval warfare',
        tag: 'general',
      };
      chai
        .request(app)
        .post('/api/v1/articles')
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.equals('Authentication error. Token required.');
          done();
        });
    });
    it('Should not allow articles without a title to be submitted', (done) => {
      const article = {
        title: '',
        article: 'The Age of Sail (usually dated as 1571–1862) was a period roughly corresponding to the early modern period in which international trade and naval warfare',
        tag: 'genral',
      };
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equals('Your article must have a title and some content');
          done();
        });
    });
    it('Should not allow articles without content to be submitted', (done) => {
      const article = {
        title: 'The Great Sails',
        article: '',
      };
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.error).to.equals('Your article must have a title and some content');
          done();
        });
    });
   /* it('Should allow a logged in employee to create an article with the rigth data', (done) => {
      const article = {
        title: 'The Great Sails',
        article: 'The Age of Sail (usually dated as 1571–1862) was a period roughly corresponding to the early modern period in which international trade and naval warfare',
      };
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(article)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.equals('success');
          done();
        });
    });*/
  });
//});
