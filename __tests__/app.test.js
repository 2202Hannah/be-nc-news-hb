const app = require(`../app.js`);
const request = require("supertest");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("Error handling", () => {
  test("404: responds with an error when passed a non existant end point", () => {
    return request(app)
      .get("/api/non-existant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/topics")
      .expect(200);
  });
  test("return an object with the expected values", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const topicsArray = body.topics;
        expect(topicsArray).toHaveLength(3);

        topicsArray.forEach(topic => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200);
  });
  test("return an object with the expected values", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body: article }) => {
        expect(article.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number)
          })
        );
      });
  });
  test("400: responds with an error when passed an article_id of an incorrect type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });
  test("404: responds with an error when passed an article_id not present in our database", () => {
    return request(app)
      .get("/api/articles/100000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found in the database");
      });
  });
});

describe("GET /api/users", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/users")
      .expect(200);
  });
  test("return an object with the values from the users table", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const usersArray = body.users;
        expect(usersArray).toHaveLength(4);

        usersArray.forEach(user => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
        });
      });
  });
});
