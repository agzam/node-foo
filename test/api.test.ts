import request from 'supertest'
import app from '../src/app'
import axios from 'axios'
import { generateData } from './fakeData'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

import { inspect } from "util"

describe('app', () => {
  it("formId is missing", (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, { message: '/formId is missing' }, done)
  });

  it('sends request to api.fillout.com', async () => {
    const mockedData = generateData(10)

    mockedAxios.get.mockResolvedValue(mockedData)

    const response = await request(app)
      .get('/testFormId')
      .expect('Content-Type', /json/)

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toStrictEqual(mockedData)
  });
});
