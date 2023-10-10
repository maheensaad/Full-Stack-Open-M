describe('Blog app', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset');
      // Create a user in the backend
      const user = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user);
  
      // Create a blog for the user
      const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://example.com',
      };
      cy.login({ username: 'testuser', password: 'testpassword' });
      cy.createBlog(blog);
      cy.visit('/');
    });
  
    it('A user who created a blog can delete it', function () {
      // Open the blog details by clicking on the blog title
      cy.contains('Test Blog Title').click();
  
      // Find the delete button and click it
      cy.get('button:contains(Delete)').click();
  
      // Confirm the deletion in the dialog
      cy.get('.blog-delete-confirmation').contains('Confirm').click();
  
      // Verify that the blog has been deleted
      cy.contains('Test Blog Title').should('not.exist');
    });
  });
  