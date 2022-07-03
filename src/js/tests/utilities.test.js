import {ensureCorrectRange, getDistanceToPoint, getAngularDifference, getDirectionToPoint} from '../utilities.js';


describe("getDistanceToPoint", () => {
  it("returns 5 for (0, 0, 3, 4)", () => {
    expect(getDistanceToPoint(0, 0, 3, 4)).toBeCloseTo(5);
  });
  it("returns 5 for (0, 0, -3, -4)", () => {
    expect(getDistanceToPoint(0, 0, 3, 4)).toBeCloseTo(5);
  });
  it("order of points does not matter", () => {
    expect(getDistanceToPoint(0, 0, 1, 1)).toBeCloseTo(getDistanceToPoint(1, 1, 0, 0));
  });
  it("returns 0 when given same point twice", () => {
    expect(getDistanceToPoint(2, 2, 2, 2)).toBe(0);
  });
});

describe("getAngularDifference", () => {
  it("returns 2 for parameters (1, -1)", () => {
    expect(getAngularDifference(1, -1)).toBeCloseTo(2);
  });
  it("returns 0 for parameters (Math.PI, -Math.PI) - these are equivalent when considering a circle", () => {
    expect(getAngularDifference(Math.PI, -Math.PI)).toBeCloseTo(0);
  });
  it("returns Math.PI * 0.5 for parameters (-Math.PI * 0.75, Math.PI * 0.75)", () => {
    expect(getAngularDifference(-Math.PI * 0.75, Math.PI * 0.75)).toBeCloseTo(Math.PI * 0.5);
  });
  it("returns 0 when one parameter is repeated", () => {
    expect(getAngularDifference(4, 4)).toBeCloseTo(0);
  });
  it("returns value in range -Math.PI <= value <= Math.PI for selection of parameters", () => {
    let param1 = 0;
    let params = [-1.5, -1.25, -1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5];
    for (let param2 of params) {
      let returnValue = getAngularDifference(param1, param2);
      expect(returnValue).toBeGreaterThanOrEqual(-Math.PI);
      expect(returnValue).toBeLessThanOrEqual(Math.PI);
    }
  });
});

describe("getDirectionToPoint", () => {
  it("returns correct result for: From(0, 0), To(0, 1)", () =>
  expect(getDirectionToPoint(0, 0, 1, 0)).toBeCloseTo(0));
  it("returns correct result for: From(0, 0), To(1, 0)", () => {
    expect(getDirectionToPoint(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
  });
  it("returns correct result for: From(0, 0), To(0, -1)", () => {
    expect(getDirectionToPoint(0, 0, 0, -1)).toBeCloseTo(-Math.PI / 2);
  });
  it("returns correct result for: From(0, 0), To(-1, 0)", () => {
    expect(getDirectionToPoint(0, 0, -1, 0)).toBeCloseTo(Math.PI);
  });
});

describe("ensureCorrectRange", () => {
  it("returns a number N such that -Math.PI <= N <= Math.PI", () => {
    expect(ensureCorrectRange(10)).toBeLessThanOrEqual(Math.PI);
    expect(ensureCorrectRange(10)).toBeGreaterThanOrEqual(-Math.PI);
  });
  it("does not return undefined for a negative parameter", () => {
    expect(ensureCorrectRange(-1)).toBeDefined();
  });
  it("does not throw Error for a negative parameter", () => {
    expect(() => ensureCorrectRange(-1)).not.toThrow();
  });
  it("returns the parameter itself if it is already within range", () => {
    expect(ensureCorrectRange(0)).toBe(0);
  });
  it("the cosine of the returned angle is equal to that of the paramter", () => {
    let angle = Math.PI * 4.34;
    expect(Math.cos(ensureCorrectRange(angle))).toBeCloseTo(Math.cos(angle));     
  });
  it("the tangent of the tangent equals the tangent of the returned value", () => {
    let angles = [-Math.PI * 4.75, -Math.PI * 4.25, Math.PI * 4.25, Math.PI * 4.75];
    for (let angle of angles) {
      expect(Math.tan(ensureCorrectRange(angle))).toBeCloseTo(Math.tan(angle));
    }
  });
});