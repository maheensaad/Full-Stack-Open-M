import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from '../src/components/BlogForm';

describe('BlogForm Component', () => {
  test('calls the event handler with the correct details when a new blog is created', () => {
    const createBlogMock = jest.fn(); // Create a mock event handler

    const component = render(<BlogForm createBlog={createBlogMock} />);

    // Define test data
    const testData = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://example.com',
    };

    // Get form fields and submit button
    const titleInput = component.getByLabelText('title:');
    const authorInput = component.getByLabelText('author:');
    const urlInput = component.getByLabelText('url:');
    const submitButton = component.getByText('Create');

    // Fill out the form with test data
    fireEvent.change(titleInput, { target: { value: testData.title } });
    fireEvent.change(authorInput, { target: { value: testData.author } });
    fireEvent.change(urlInput, { target: { value: testData.url } });

    // Submit the form
    fireEvent.click(submitButton);

    // Ensure the event handler is called with the correct details
    expect(createBlogMock).toHaveBeenCalledWith(testData);

    // Ensure the form fields are empty after submission
    expect(titleInput.value).toBe('');
    expect(authorInput.value).toBe('');
    expect(urlInput.value).toBe('');
  });
});
