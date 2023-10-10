describe('Blog app', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset');
      // Create a user who created a blog
      const user1 = {
        username: 'creator',
        name: 'Blog Creator',
        password: 'password1',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user1);
  
      // Create another user
      const user2 = {
        username: 'otheruser',
        name: 'Other User',
        password: 'password2',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user2);
  
      // Create a blog for the creator user
      const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://example.com',
      };
      cy.login({ username: 'creator', password: 'password1' });
      cy.createBlog(blog);
  
      // Logout and log in as another user
      cy.logout();
      cy.login({ username: 'otheruser', password: 'password2' });
      cy.visit('/');
    });
  
    it('Only the creator can see the delete button of a blog', function () {
      // Verify the delete button is not visible for the other user
      cy.contains('Test Blog Title').click();
      cy.get('button:contains(Delete)').should('not.exist');
    });
  });
  