/// <reference types="cypress" />

describe('Admin Registration API', () => {
  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8001/adminservices/register'; // Use environment variable or fallback to local

  it('should register a new admin successfully', () => {
    const adminData = {
      email: 'elcollinz@gmail.com',
      password: 'favourboy', // Use a more secure example password
    };

    cy.request('POST', apiUrl, adminData)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'User created successfully');
        expect(response.body).to.have.property('userId').and.to.be.a('string');
      });
  });

  it('should return an error for missing fields', () => {
    cy.request({
      method: 'POST',
      url: apiUrl,
      body: {}, // Empty body to simulate missing fields
      failOnStatusCode: false, // Prevent Cypress from failing automatically on 4xx/5xx responses
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message', 'Error creating user test');
    });
  });
});
