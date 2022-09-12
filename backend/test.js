import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { before, beforeEach, afterEach } from 'mocha';
import app from './server.js';

// Configure chai
chai.use(chaiHttp);
chai.should();

const baseURL = '/api';

function expectValidQuote(quote) {
  expect(quote.quote).to.be.a('string').that.is.not.empty;
  expect(quote.by).to.be.a('string').that.is.not.empty;
}

function expectEqualQuote(actual, expected) {
  expectValidQuote(actual);
  expectValidQuote(expected);
  expect(actual).to.deep.equal(expected);
}

describe('Quotes', function () {
  this.timeout(5000);

  const defaultAuthor = 'Unknown';

  describe('GET Quotes', () => {
    it('should get all quotes', async () => {
      const res = await chai.request(app).get(baseURL);

      expect(res.status).to.equal(200);
      // expect(res.body).to.be.json;
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('POST Quotes', () => {
    const testQuote = {
      quote: 'TEST_QUOTE',
      by: 'TEST_BY',
    };

    it('should add quote with valid fields', async () => {
      const res = await chai.request(app).post(baseURL).send(testQuote);

      chai.request(app).delete(baseURL + '/0');
      expect(res.status).to.equal(201);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, testQuote);
    });

    it('should add valid quote without valid author', async () => {
      const expectedQuote = {
        ...testQuote,
        by: defaultAuthor,
      };
      const testQuoteNoAuthor = {
        quote: 'TEST_QUOTE',
      };

      let res = await chai.request(app).post(baseURL).send(testQuoteNoAuthor);
      expect(res.status).to.equal(201);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, expectedQuote);
      await chai.request(app).delete(baseURL + '/0');

      const testQuoteAuthorIsNumber = { ...testQuoteNoAuthor, by: 123 };
      res = await chai.request(app).post(baseURL).send(testQuoteAuthorIsNumber);
      await chai.request(app).delete(baseURL + '/0');

      expect(res.status).to.equal(201);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, expectedQuote);

      const testQuoteAuthorIsBlankString = { ...testQuoteNoAuthor, by: '      ' };
      res = await chai.request(app).post(baseURL).send(testQuoteAuthorIsBlankString);
      await chai.request(app).delete(baseURL + '/0');

      expect(res.status).to.equal(201);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, expectedQuote);
    });

    it('should fail to add quote with missing quote field', async () => {
      const res = await chai.request(app).post(baseURL).send({
        by: 'TEST_BY',
      });

      expect(res.status).to.equal(400);
    });
  });

  describe('UPDATE Quote', () => {
    const testQuote = {
      quote: 'TEST_QUOTE',
      by: 'TEST_BY',
    };

    const updatedQuote = 'UPDATED_QUOTE';
    const updatedBy = 'UPDATED_BY';
    beforeEach(async () => {
      await chai.request(app).post(baseURL).send(testQuote);
    });

    afterEach(async () => {
      await chai.request(app).delete('/api/0');
    });

    it('should update quote', async () => {
      const updateFields = {
        quote: updatedQuote,
      };
      const res = await chai.request(app).put('/api/0').send(updateFields);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, { ...testQuote, quote: updatedQuote });
    });

    it('should update author', async () => {
      const updateFields = {
        by: updatedBy,
      };
      const res = await chai.request(app).put('/api/0').send(updateFields);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, { ...testQuote, by: updatedBy });
    });

    it('should update quote and author', async () => {
      const updateFields = {
        quote: updatedQuote,
        by: updatedBy,
      };
      const res = await chai
        .request(app)
        .put(baseURL + '/0')
        .send(updateFields);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
      expectEqualQuote(res.body.data, updateFields);
    });

    it('should fail to update quote when index invalid out of range', async () => {
      const index = 1000000000;
      const updateFields = {
        quote: updatedQuote,
        by: updatedBy,
      };
      const res = await chai
        .request(app)
        .put(baseURL + `/${index}`)
        .send(updateFields);

      expect(res.status).to.equal(400);
    });

    it('should fail to update quote when index invalid', async () => {
      const index = -1;
      const updateFields = {
        quote: updatedQuote,
        by: updatedBy,
      };
      const res = await chai
        .request(app)
        .put(baseURL + `/${index}`)
        .send(updateFields);

      expect(res.status).to.equal(400);
    });

    it('should fail to update quote when index not a number', async () => {
      const index = 'quote';
      const updateFields = {
        quote: updatedQuote,
        by: updatedBy,
      };
      const res = await chai
        .request(app)
        .put(baseURL + `/${index}`)
        .send(updateFields);

      expect(res.status).to.equal(400);
    });
  });

  describe('DELETE quote', () => {
    let index = 0;
    const testQuote = {
      quote: 'TEST_QUOTE',
      by: 'TEST_BY',
    };

    before(async () => {
      await chai.request(app).post(baseURL).send(testQuote);
    });

    it('should delete quote', async () => {
      const res = await chai.request(app).delete(baseURL + `/${index}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.not.be.undefined;
      expect(res.body.data).to.deep.equal(testQuote);
    });

    it('should fail to delete quote when index not valid', async () => {
      index = 10000;
      let res = await chai.request(app).delete(baseURL + `/${index}`);
      expect(res.status).to.equal(400);

      index = -1;
      res = await chai.request(app).delete(baseURL + `/${index}`);
      expect(res.status).to.equal(400);

      index = 'asd';
      res = await chai.request(app).delete(baseURL + `/${index}`);
      expect(res.status).to.equal(400);
    });
  });
});
