/* eslint-disable no-undef */
describe('Home', () => {
  it('see button to loggin', () => {
    cy.visit('http://localhost:3000/campaigns');
    cy.contains('Connexion avec Google');
  })

  it('log in with google account', () => {
    cy.visit('http://localhost:3000/campaigns');
    cy.login();
    cy.contains('Mes campagnes');
  })
})