const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name');
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title and URL are required' });
  }

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);

  if (!blogToDelete) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blogToDelete.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'You are not authorized to delete this blog' });
  }

  await Blog.deleteOne({ _id: request.params.id });
  response.status(204).end();
});

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { id } = request.params;
  const updatedBlogData = request.body;
  const user = request.user;

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, {new: true}).populate('user', 'username name');

  if (updatedBlog) {
    if (updatedBlog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'You are not authorized to update this blog' });
    }

    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: 'Blog not found' });
  }
});

module.exports = blogsRouter;
