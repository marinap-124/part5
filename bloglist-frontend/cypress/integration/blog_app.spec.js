describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Marina',
      username: 'marina',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    const user_1 = {
      name: 'Karina',
      username: 'karina',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user_1)

    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
    cy.contains('Blogs')
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('marina')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Marina logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('mmmmm')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Marina logged in')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {

      cy.login({ username: 'marina', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('marina')
      cy.get('#url').type('http://myblog.com')
      cy.contains('save').click()
      cy.contains('a blog created by cypress marina')
    })

    describe('and a blog exists', function () {

      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'marina',
          url: 'http://myblog.com'
        })
      })

      it('A blog can be liked', function() {

        cy.contains('another blog cypress')
        cy.contains('view').click()
        //cy.contains('another blog cypress').children('button').contains('view').click()

        cy.get('#likes-button').click()
        //cy.contains('another blog cypress').children('button').get('#likes-button').click()
        cy.get('#likes').contains('1')
        //cy.contains('another blog cypress').children('span').get('#likes').contains('1')

        cy.get('#likes-button').click()
        //cy.contains('another blog cypress').children('button').get('#likes-button').click()
        cy.get('#likes').contains('2')
        //cy.contains('another blog cypress').children('span').get('#likes').contains('1')
      })

      it('A blog can be deleted', function() {

        cy.contains('another blog cypress')
        cy.contains('view').click()

        cy.contains('remove').click()
        cy.get('.message').contains('Deleted')
      })

      it('A blog can not be deleted by another user', function() {

        cy.contains('another blog cypress')
        cy.contains('view').click()

        cy.get('#logout-button').click()

        cy.contains('login').click()
        cy.get('#username').type('karina')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
        cy.contains('Karina logged in')

        cy.contains('view').click()
        cy.get('html').should('not.contain', 'remove')
      })

    })

    describe('and 2 blogs exists', function () {

      beforeEach(function () {
        cy.createBlog({
          title: 'first blog cypress',
          author: 'marina',
          url: 'http://myblog.com'
        })

        cy.createBlog({
          title: 'second blog cypress',
          author: 'marina',
          url: 'http://myblog.com'
        })
      })

      it('A blog most liked first', function() {

        cy.contains('first blog cypress')
        cy.contains('second blog cypress')

        cy.contains('second blog cypress').children('button').contains('view').click()

        cy.get('.blogStyle').then(($divs) => {
          expect($divs).to.have.length(2)
          expect($divs.eq(0)).to.contain('first blog cypress')
          expect($divs.eq(1)).to.contain('second blog cypress')
        })

        cy.contains('second blog cypress marina').children('span').children('button').get('#likes-button').click()
        cy.get('#likes').contains('1')
        cy.contains('second blog cypress marina').children('span').children('button').get('#likes-button').click()
        cy.get('#likes').contains('2')

        cy.get('.blogStyle').then(($divs) => {
          expect($divs).to.have.length(2)
          expect($divs.eq(0)).to.contain('second blog cypress')
          expect($divs.eq(1)).to.contain('first blog cypress')
        })
      })
    })
  })
})