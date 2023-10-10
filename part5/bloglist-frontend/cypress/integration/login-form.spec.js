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
    });
  
    it('Login form is shown', function () {
      cy.get('form').should('have.id', 'login-form');
      cy.get('input[name="username"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Login');
    });
  
    describe('Login', function () {
      it('succeeds with correct credentials', function () {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="password"]').type('testpassword');
        cy.get('button[type="submit"]').click();
        cy.contains('Test User logged in');
      });
  
      it('fails with wrong credentials', function () {
        cy.get('input[name="username"]').type('testuser');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
        cy.get('.error').should('contain', 'Wrong username or password');
        cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
      });
    });
  });
  