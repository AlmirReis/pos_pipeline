import { jest } from "@jest/globals";
import { RideService } from "../../src/services/ride.service.js";
import { createRide } from "../helpers.js";
import "whatwg-fetch"; // garante fetch no ambiente de teste

describe(RideService.name, () => {
  /** @type {import('jest-mock').MockInstance<typeof fetch>} */
  let fetchMock;
  /** @type {RideService} */
  let sut;

  beforeEach(() => {
    fetchMock = jest.spyOn(globalThis, "fetch");
    sut = new RideService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should retrieve rides from the server when getRides is called", async () => {
    const expectedRides = [createRide()];
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(expectedRides), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const actual = await sut.getRides();
    expect(actual).toStrictEqual(expectedRides);
  });

  it("should retrieve a specific ride from the server when getRide is called", async () => {
    const expectedRide = createRide({ id: "big-coaster" });
    const rides = [expectedRide, createRide({ id: "small-coaster" })];

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(rides), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const actual = await sut.getRide("big-coaster");
    expect(actual).toStrictEqual(expectedRide);
  });
});
