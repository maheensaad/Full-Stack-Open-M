import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Blog from '../src/components/Blog';

describe('Blog Component', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 42,
    user: {
      name: 'Test User',
    },
  };

  test('renders title and author, but not URL and likes by default', () => {
    const component = render(<Blog blog={blog} />);

    // Assert that title and author are rendered
    expect(component.getByText('Test Blog Title Test Author')).toBeInTheDocument();

    // Assert that URL and likes are not rendered by default
    expect(component.queryByText('http://example.com')).toBeNull();
    expect(component.queryByText('Likes: 42')).toBeNull();
  });

  test('displays URL and likes when "Show Details" button is clicked', () => {
    const component = render(<Blog blog={blog} />);
    const button = component.getByText('Show Details');

    // Click the "Show Details" button
    fireEvent.click(button);

    // Assert that URL and likes are now displayed
    expect(component.getByText('http://example.com')).toBeInTheDocument();
    expect(component.getByText('Likes: 42')).toBeInTheDocument();
  });

  test('calls the like event handler twice when the like button is clicked twice', () => {
    const mockLikeHandler = jest.fn(); // Create a mock event handler

    const component = render(
      <Blog blog={blog} handleLike={mockLikeHandler} />
    );

    // Click the "Show Details" button to reveal the like button
    const showDetailsButton = component.getByText('Show Details');
    fireEvent.click(showDetailsButton);

    // Click the "Like" button twice
    const likeButton = component.getByText('Like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    // Ensure the event handler is called twice
    expect(mockLikeHandler).toHaveBeenCalledTimes(2);
  });

});
