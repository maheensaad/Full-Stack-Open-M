import React, { useState } from 'react';
import Togglable from './Togglable';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  const handleCreateBlog = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
    // Close the form after creating a new blog
    setFormVisible(false);
  };

  return (
    <Togglable buttonLabel="New Blog" visible={formVisible} setVisible={setFormVisible}>
      <div>
        <h2>Create a New Blog</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </Togglable>
  );
};

export default BlogForm;