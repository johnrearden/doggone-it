const {ensureCorrectRange, getDistanceToPoint} = require('../utilities');


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
  })
});

describe("getAngularDifference", () => {
  it("")
})

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
  })
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
  })
});