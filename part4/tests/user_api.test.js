const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

describe('Creating Users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('fails with a 400 status code if username is less than 3 characters', async () => {
    const newUser = {
      username: 'Ma',
      password: 'password123',
      name: 'Maheen Saad',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toContain(
          'Username and password must be at least 3 characters long'
        );
      });
  });

  test('fails with a 400 status code if password is less than 3 characters', async () => {
    const newUser = {
      username: 'Maheen_saad',
      password: 'pa',
      name: 'Maheen Saad',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toContain(
          'Username and password must be at least 3 characters long'
        );
      });
  });

  test('fails with a 400 status code if username is not unique', async () => {
    const existingUser = {
      username: 'Maheen_Saad',
      password: 'password123',
      name: 'Maheen Saad',
    };

    await api.post('/api/users').send(existingUser);

    const duplicateUser = {
      username: 'Maheen_Saad',
      password: 'anotherpassword',
      name: 'Duplicate User',
    };

    await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect((response) => {
        expect(response.body.error).toContain('Username must be unique');
      });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
