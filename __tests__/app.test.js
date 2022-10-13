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
  test("return an object with the expected values of the requested article with comments", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body: article }) => {
        expect(article.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11
          })
        );
      });
  });
  test("return an object with the expected values for the article when there are no comments", () => {
    return request(app)
      .get("/api/articles/12")
      .then(({ body: article }) => {
        expect(article.article).toEqual(
          expect.objectContaining({
            article_id: 12,
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            comment_count: 0
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

describe("GET /api/articles?topic=:topic", () => {
  test("return status 200 when successful with no query", () => {
    return request(app)
      .get("/api/articles")
      .expect(200);
  });
  test("return an object with the expected article values with not given a query", () => {
    return request(app)
      .get("/api/articles")
      .then(response => {
        const {
          body: { articles }
        } = response;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at");
        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            })
          );
        });
      });
  });
  test("returns an object with the expected article values when given a query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(response => {
        const {
          body: { articles }
        } = response;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy("created_at");
        articles.forEach(article => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            })
          );
        });
      });
  });
  test("400: responds with an error when passed a topic thats doesn't exist", () => {
    return request(app)
      .get("/api/articles/topic=555")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("return status 200 when successful", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200);
  });
  test("return an object with the comments for the relevant article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const commentsArray = body.comments;
        expect(commentsArray).toHaveLength(11);
        expect(commentsArray).toBeSortedBy("created_at", { descending: true });

        commentsArray.forEach(comment => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          );
        });
      });
  });
  test("400: responds with an error when passed an article_id that is invalid", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("404: responds with an error when passed an article_id not present in our database", () => {
    return request(app)
      .get("/api/articles/100000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found in the database");
      });
  });
  test("200: returns an empty array when passed an article that has no comments", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(response => {
        const {
          body: { comments }
        } = response;
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns status 201 and the inserted comment when successful", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send({ username: "icellusedkars", body: "this is great!" })
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            body: "this is great!",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String)
          })
        );
      });
  });
  test("400: responds with an error when there is no data in the post request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request");
      });
  });
  test("400: responds with an error when there no body in the post request", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "icellusedkars" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request");
      });
  });
  test("404: responds with an error when passed a username that is not in the database", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "han", body: "this is great!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Key not found in the database");
      });
  });
  test("400: responds with an error when passed an article_id that is invalid", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({ username: "icellusedkars", body: "this is great!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("You have made a bad request - invalid type");
      });
  });
  test("404: responds with an error when passed an article_id not present in our database", () => {
    return request(app)
      .post("/api/articles/100000/comments")
      .send({ username: "icellusedkars", body: "this is great!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Key not found in the database");
      });
  });
});
