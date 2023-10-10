import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notification, setNotification] = useState(null); // New state for notifications
  const blogFormRef = React.createRef(); // Create a ref for the BlogForm component

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    // Check if user is already logged in (e.g., using a stored token)
    const loggedUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // Set the token for authenticated requests
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setUsername('');
      setPassword('');
      blogService.setToken(user.token); // Set the token for authenticated requests
      window.localStorage.setItem('loggedInUser', JSON.stringify(user)); // Store user data in local storage
    } catch (exception) {
      setErrorMessage('Wrong username or password'); // Set an error message

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null); // Clear the token
    window.localStorage.removeItem('loggedInUser'); // Remove user data from local storage
    showNotification('Logged out successfully', 'success');
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      // Include the user data from the response
      createdBlog.user = user;
  
      setBlogs([...blogs, createdBlog]);
      showNotification(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, 'success');
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      showNotification('Error creating blog', 'error');
    }
  };
  
  const handleLike = async (blog) => {
    try {
      // Create a copy of the blog with the updated likes
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
  
      // Make an HTTP PUT request to update the blog's likes
      const response = await blogService.update(blog.id, updatedBlog);
  
      // Update the state with the updated blog
      setBlogs(blogs.map((b) => (b.id === blog.id ? response : b)));
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes);
  

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Clear the notification after a delay
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div>
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div>
              Username:
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              Password:
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>

          <BlogForm createBlog={handleCreateBlog} ref={blogFormRef} />

          <ul>
            {sortedBlogs.map((blog) => (
              <li key={blog.id}>
                <Blog blog={blog} handleLike={handleLike} />
              </li>
            ))}
          </ul>

        </div>
      )}
    </div>
  );
};

export default App;