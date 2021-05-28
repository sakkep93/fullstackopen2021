describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
    const user = { name: 'Test User Cypress', username: 'testusercypress', password: 'password' }
    const another = { name: 'Bad User', username: 'baduser', password: 'password' }
    cy.request('POST', 'http://localhost:3000/api/users', user)
    cy.request('POST', 'http://localhost:3000/api/users', another)
    cy.visit('http://localhost:3000')
  })

  // this test is a replacement for exercise 5.17
  // since by default in this application the login form is NOT shown
  it('Login form can be opened by clicking button', function() {

    // before clicking login form should be hidden
    cy.get('form').parent().parent().should('have.css', 'display', 'none')

    cy.contains('log in').click()

    // after clicking form becomes visible
    cy.get('form').parent().parent().should('not.have.css', 'display', 'none')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {

      cy.get('html').should('not.contain', 'Test User Cypress logged in')

      cy.contains('log in').click()
      cy.get('#username').type('testusercypress')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('Test User Cypress logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('testusercypress')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Test User Cypress logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testusercypress', password: 'password' })
    })

    it('a blog can be created', function() {

      cy.get('html').should('not.contain', 'Cypress Blog by Test User Cypress')

      cy.contains('new blog').click()
      cy.get('#blogTitle').type('Cypress Blog')
      cy.get('#blogAuthor').type('Test User Cypress')
      cy.get('#blogUrl').type('https://docs.cypress.io/guides/overview/why-cypress')

      cy.get('#create-blog-button').click()

      cy.get('.notification')
        .should('contain', 'a new blog Cypress Blog by Test User Cypress added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('#blog-list').children().first().contains('Cypress Blog by Test User Cypress')
    })

    describe('and when there are blogs with 0 likes', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first blog', author: 'Eminem', url: 'some url' })
        cy.createBlog({ title: 'second blog', author: 'Jay Z', url: 'another one' })
      })

      it('any of those blogs can be liked', function() {

        // first blog liked 1 times
        cy.contains('first blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .should('contain', '0 likes')
          .contains('like')
          .click()
          .parent()
          .should('not.contain', '0 likes')
          .and('contain', '1 likes')

        // second blog liked 2 times
        cy.contains('second blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .should('contain', '0 likes')
          .contains('like')
          .click()
          .wait(500)
          .click()
          .parent()
          .should('not.contain', '0 likes')
          .and('not.contain', '1 likes')
          .and('contain', '2 likes')
      })
      it('and the user who created them can remove any of them', function() {

        // before deleting (clicking remove button)
        cy.get('#blog-list').children().contains('first blog')
        cy.get('html').should('not.contain', 'Removed blog first blog by Eminem')

        // navigating to remove button of first blog and clicking it
        cy.contains('first blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .contains('remove')
          .click()

        // as a sign of removal from database
        // check notification
        cy.get('.notification')
          .should('contain', 'Removed blog first blog by Eminem')
          .and('have.css', 'color', 'rgb(0, 128, 0)')

        // and no rendered list of blogs to not have removed blog
        cy.get('#blog-list').children().should('not.contain', 'first blog')
      })

      it('but none of them can be removed by any other user', function() {

        cy.contains('logout').click()
        cy.login({ username: 'baduser', password: 'password' })

        // both blogs still in database
        cy.get('#blog-list').children().should('have.length', 2)

        // navigating to remove button of first blog and clicking it
        cy.contains('first blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .contains('remove')
          .click()

        cy.contains('second blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .contains('remove')
          .click()

        // after deletion attempts, both blogs still in database
        cy.get('#blog-list').children().should('have.length', 2)
      })

      it('the order of shown blogs changes accordingly their number of likes', function() {

        // both blogs 0 likes, first blog is first child
        cy.get('#blog-list').children().should('contain', 'first blog')

        // first blog liked 1 times
        cy.contains('first blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .should('contain', '0 likes')
          .contains('like')
          .click()

        // second blog liked 2 times
        cy.contains('second blog')
          .parent()
          .siblings()
          .contains('view')
          .click()
          .siblings()
          .should('contain', '0 likes')
          .contains('like')
          .click()
          .wait(500)
          .click()

        // after liking-spree, second blog comes up top! OMG!
        cy.get('#blog-list').children().should('contain', 'second blog')
      })
    })
  })

  after(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset')
  })
})
