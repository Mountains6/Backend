import request from "supertest";
import app from "../app";
import { v7 } from "./_mocks_/uuid";

jest.mock("uuid", () => ({ v7: jest.fn(() => "mock-uuid-v7") }));

describe("check app", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/helth");
    expect(res.status).toBe(200);
  });


  
});
