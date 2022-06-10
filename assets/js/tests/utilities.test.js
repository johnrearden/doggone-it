const {ensureCorrectRange} = require('../utilities');

describe("ensureCorrectRange", () => {
  test("tests that the function returns a number N such that -Math.PI <= N <= Math.PI", () => {
    expect(ensureCorrectRange(10)).toBeLessThanOrEqual(Math.PI);
    expect(ensureCorrectRange(10)).toBeGreaterThanOrEqual(-Math.PI);
  });
  test("test that a negative parameter does not return undefined", () => {
    expect(ensureCorrectRange(-1)).toBeDefined();
  });
  test("tests that a negative parameter does not throw Error", () => {
    expect(() => ensureCorrectRange(-1)).not.toThrow();
  })
  test("tests that returns the parameter itself if it is already within range", () => {
    expect(ensureCorrectRange(0)).toBe(0);
  });
  test("tests that the cosine of the returned angle is equal to that of the paramter", () => {
    let angle = Math.PI * 4.34;
    expect(Math.cos(ensureCorrectRange(angle))).toBeCloseTo(Math.cos(angle));     
  });
});