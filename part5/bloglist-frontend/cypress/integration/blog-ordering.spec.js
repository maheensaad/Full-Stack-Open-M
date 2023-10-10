describe('Blog app', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset');
  
      // Create a user
      const user = {
        username: 'testuser',
        name: 'Test User',
        password: 'password',
      };
      cy.request('POST', 'http://localhost:3003/api/users/', user);
  
      // Log in and create some blogs
      cy.login({ username: 'testuser', password: 'password' });
  
      const blogs = [
        {
          title: 'Blog 1',
          author: 'Author 1',
          url: 'http://example1.com',
          likes: 5,
        },
        {
          title: 'Blog 2',
          author: 'Author 2',
          url: 'http://example2.com',
          likes: 10,
        },
        {
          title: 'Blog 3',
          author: 'Author 3',
          url: 'http://example3.com',
          likes: 2,
        },
      ];
  
      blogs.forEach((blog) => {
        cy.createBlog(blog);
      });
    });
  
    it('Blogs are ordered by likes', function () {
      cy.get('.blog').should('have.length', 3);
  
      // Ensure the first blog has the most likes
      cy.get('.blog').eq(0).should('contain', 'Blog 2');
      cy.get('.blog').eq(1).should('contain', 'Blog 1');
      cy.get('.blog').eq(2).should('contain', 'Blog 3');
    });
  });
  