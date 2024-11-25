import { describe, expect, vi, it } from 'vitest';
import request from "supertest";
import { app } from "../index"
import { prismaClient } from '../__mocks__/db';

// mocking db request
// vi.mock('../db', () => ({
//   prismaClient: { calculate: { create: vi.fn() } }
// }));

// deep mocking prisma client
vi.mock('../db');

describe("POST /calculate", () => {
  it("should return the calculate of two numbers", async () => {

    // mocking return values
    prismaClient.calculate.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      type: "SUM",
      result: 3
    });

    // spys
    vi.spyOn(prismaClient.calculate, "create");

    const res = await request(app).post("/calculate").send({
      a: 1,
      b: 2
    });

    // verify spy
    expect(prismaClient.calculate.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        type: "SUM",
        result: 3
      }
    })
    
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/calculate").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });

});


describe("GET /calculate", () => {
  it("should return the calculate of two numbers", async () => {
    const res = await request(app)
      .get("/calculate")
      .set({
        a: "1",
        b: "2"
      })
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app)
      .get("/calculate").send();
    expect(res.statusCode).toBe(411);
  });

});