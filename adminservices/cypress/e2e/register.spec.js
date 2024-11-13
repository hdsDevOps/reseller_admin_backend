
describe('Admin Registration API', () => {
    const apiUrl = 'http://localhost:8001/adminservices/register'; // Replace with your API URL
  
    it('should register a new admin successfully', () => {
      const adminData = {
        email: 'elcollinz@gmail.com',
        password: 'elcollinz@gmail.com',
      };
  
      cy.request('POST', apiUrl, adminData)
        .then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('message', 'User created successfully');
          expect(response.body).to.have.property('userId');
        });
    });
  
    it('should return an error for missing fields', () => {
      cy.request({
        method: 'POST',
        url: apiUrl,
        body: {},
        failOnStatusCode: false, // Prevent Cypress from failing the test on 4xx/5xx responses
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message', 'Error creating user test');
      });
    });
  });
  