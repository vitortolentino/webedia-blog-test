function sum(a, b) {
  return a + b;
}

describe('sum', () => {
  it('should return 6 if 4 and 2 is passed by arguments', () => {
    const result = sum(4, 2);
    const expected = 6;
    expect(result).toBe(expected);
  });

  it('should return 7 if 6 and 1 is passed by arguments', () => {
    const result = sum(6, 1);
    const expected = 7;
    expect(result).toBe(expected);
  });

  it('should return 12 if 6 and 6 is passed by arguments', () => {
    const result = sum(6, 6);
    const expected = 12;
    expect(result).toBe(expected);
  });
});
