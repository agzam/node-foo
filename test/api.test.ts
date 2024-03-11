import request from "supertest";
import app from "../src/app";
import axios from "axios";
import { generateData } from "./fakeData";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { inspect } from "util";

beforeEach(() => {
  mockedAxios.get.mockClear();
});

describe("app", () => {
  it("formId is missing", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200, { message: "/formId is missing" }, done);
  });

  it("sends request to api.fillout.com", async () => {
    const mockedData = generateData(10);

    mockedAxios.get.mockResolvedValue(mockedData);

    const response = await request(app)
      .get("/testFormId")
      .expect("Content-Type", /json/);

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toStrictEqual(mockedData);
  });

  it("passes additional query params through", async () => {
    const response = await request(app)
      .get("/testFormId?sort=foo&status&unexpectedParam=novalue")
      .expect("Content-Type", /json/);

    const params = mockedAxios.get.mock.calls?.[0]?.[1]?.params;

    expect(params).toHaveProperty("sort");
    expect(params).toHaveProperty("status");
    expect(params).not.toHaveProperty("unexpectedParam");
  });
});

import { originalAPIResponseData } from "./fixtures/filters";

describe("filter questions", () => {
  it("skips filtration when no filters ", async () => {
    const mockedData = generateData(1);
    mockedAxios.get.mockResolvedValue(mockedData);
    const response = await request(app)
      .get("/testFormId?filters=null")
      .expect("Content-Type", /json/);

    expect(response.body).toStrictEqual(mockedData);
  });

  it("filter numbers using less than", async () => {
    const mockedData = { data: { ...originalAPIResponseData } };
    mockedAxios.get.mockResolvedValue(mockedData);
    const filters = [
      {
        id: "74ec3caf-72a8-445c-a987-4f50d829728c",
        condition: "less_than",
        value: "120",
      },
    ];
    const filtersAsQueryParams = encodeURIComponent(JSON.stringify(filters));

    const response = await request(app)
      .get(`/testFormId?filters=${filtersAsQueryParams}`)
      .expect("Content-Type", /json/);
    // should only match the first element
    expect(response.body.data.questions).toStrictEqual([
      originalAPIResponseData.questions[0],
    ]);
  });

  it("filter numbers using greater than", async () => {
    const mockedData = { data: { ...originalAPIResponseData } };
    mockedAxios.get.mockResolvedValue(mockedData);
    const filters = [
      {
        id: "74ec3caf-72a8-445c-a987-4f50d829728c",
        condition: "greater_than",
        value: "120",
      },
    ];
    const filtersAsQueryParams = encodeURIComponent(JSON.stringify(filters));

    const response = await request(app)
      .get(`/testFormId?filters=${filtersAsQueryParams}`)
      .expect("Content-Type", /json/);

    // should only match the second element
    expect(response.body.data.questions).toStrictEqual([
      originalAPIResponseData.questions[1],
    ]);
  });

  it("filter dates using less than", async () => {
    const mockedData = { data: { ...originalAPIResponseData } };
    mockedAxios.get.mockResolvedValue(mockedData);
    const filters = [
      {
        id: "52872416-f20a-4d49-a2d4-a0c040dd9154",
        condition: "less_than",
        value: "2024-04-11T12:19:42.081Z",
      },
    ];
    const filtersAsQueryParams = encodeURIComponent(JSON.stringify(filters));

    const response = await request(app)
      .get(`/testFormId?filters=${filtersAsQueryParams}`)
      .expect("Content-Type", /json/);

    // should match Third and Fourth
    expect(response.body.data.questions).toStrictEqual([
      originalAPIResponseData.questions[2],
      originalAPIResponseData.questions[3],
    ]);
  });

  it("filter dates using greater than", async () => {
    const mockedData = { data: { ...originalAPIResponseData } };
    mockedAxios.get.mockResolvedValue(mockedData);
    const filters = [
      {
        id: "52872416-f20a-4d49-a2d4-a0c040dd9154",
        condition: "greater_than",
        value: "2024-02-11T12:19:42.081Z",
      },
    ];
    const filtersAsQueryParams = encodeURIComponent(JSON.stringify(filters));

    const response = await request(app)
      .get(`/testFormId?filters=${filtersAsQueryParams}`)
      .expect("Content-Type", /json/);

    // should match Third and Fourth
    expect(response.body.data.questions).toStrictEqual([
      originalAPIResponseData.questions[2],
      originalAPIResponseData.questions[3],
    ]);
  });
});
