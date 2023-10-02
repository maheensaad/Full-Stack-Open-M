const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('../tests/test_helper');

describe('Blog posts', () => {
  let token;

  const getToken = async () => {
    const user = {
      username: 'mluukkai',
      password: 'salainen',
    };

    const response = await api.post('/api/login').send(user);

    token = response.body.token;
  };

  beforeAll(async () => {
    await Blog.deleteMany({});
    await getToken();
  });

  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns blog posts with id property', async () => {
    await Blog.insertMany(helper.initialBlogs);

    const response = await api.get('/api/blogs');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toMatch(/application\/json/);

    const { id } = response.body[response.body.length - 1];
    expect(id).toBeDefined();
  });

  test('creates a new blog post', async () => {
    const newBlog = {
      title: "Microservices and the First Law of Distributed Objects",
      author: "Martin Fowler",
      url: "https://martinfowler.com/articles/distributed-objects-microservices.html",
      likes: 0,
    };
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const response = await api.get('/api/blogs');
  
    const titles = response.body.map(blog => blog.title);
  
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain(
      'Microservices and the First Law of Distributed Objects'
    );
  });
  

  test('returns 401 Unauthorized if token is missing', async () => {
    const newBlog = {
      title: "Another Blog",
      author: "John Doe",
      url: "https://example.com",
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });

  test('creates a new blog post with default likes', async () => {
    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedBlog = response.body;
    expect(savedBlog.likes).toBe(0);
  });

  test('responds with 400 Bad Request if title is missing', async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });

  test('responds with 400 Bad Request if url is missing', async () => {
    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
});

describe('Deleting a blog post', () => {
  let savedBlog;

  beforeAll(async () => {
    const newBlog = new Blog({
      title: 'To Be Deleted',
      author: 'Maheen',
      url: 'https://apple.com',
      likes: 5,
    });
    savedBlog = await newBlog.save();
  });

  test('deletes a blog post', async () => {
    const idToDelete = savedBlog._id;

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(204);

    const deletedBlog = await Blog.findById(idToDelete);
    expect(deletedBlog).toBeNull();
  });

  test('returns 404 if blog post not found', async () => {
    const nonExistentId = '6f96a1f29a48496c1c0cd4c4';

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .expect(404);
  });
});

describe('Updating a blog post', () => {
  let savedBlog;

  beforeAll(async () => {
    const newBlog = new Blog({
      title: 'To Be Updated',
      author: 'Maheen',
      url: 'https://example.com',
      likes: 5,
    });
    savedBlog = await newBlog.save();
  });

  test('updates the number of likes', async () => {
    const idToUpdate = savedBlog._id;
    const updatedLikes = 10;

    const updatedBlogData = {
      likes: updatedLikes,
    };

    const response = await api
      .put(`/api/blogs/${idToUpdate}`)
      .send(updatedBlogData)
      .expect(200);

    expect(response.body.likes).toBe(updatedLikes);
  });

  test('returns 404 if blog post not found', async () => {
    const nonExistentId = '6f96a1f29a48496c1c0cd4c4';

    const updatedBlogData = {
      likes: 10,
    };

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedBlogData)
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
