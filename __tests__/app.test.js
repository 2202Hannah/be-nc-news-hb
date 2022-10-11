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
        expect(body.msg).toBe("You have made a bad request - invalid type");
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

describe("PATCH /api/articles/:article_id", () => {
  test("returns status 200 and the updated object with updated votes amount when successful", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: -100 })
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0
          })
        );
      });
  });
  test("200: returns the article unchanged when passed an empty object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100
          })
        );
      });
  });
  test("400: responds with an error when passed an article_id of an incorrect type", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("400: responds with an error when passed a votes update that is an invalid type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not-a-number" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("404: responds with an error when passed an article_id not present in our database", () => {
    return request(app)
      .patch("/api/articles/100000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found in the database");
      });
  });
});
