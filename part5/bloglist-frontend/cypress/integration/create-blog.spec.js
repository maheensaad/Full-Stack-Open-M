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
      cy.visit('/');
  
      // Log in the user
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('testpassword');
      cy.get('button[type="submit"]').click();
    });
  
    describe('When logged in', function () {
      it('A blog can be created', function () {
        // Click on the button to open the new blog form
        cy.contains('New Blog').click();
  
        // Fill in the form with blog details
        cy.get('input[name="title"]').type('Test Blog Title');
        cy.get('input[name="author"]').type('Test Author');
        cy.get('input[name="url"]').type('http://example.com');
        cy.get('button[type="submit"]').click();
  
        // Verify the new blog is in the list of blogs
        cy.contains('Test Blog Title');
        cy.contains('Test Author');
      });
    });
  });
  