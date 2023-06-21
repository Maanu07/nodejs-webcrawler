const { test, expect } = require("@jest/globals");
const { sortPages } = require("./report");

test("testing sortPages function", () => {
  const inputPages = {
    "http://wagslane.dev": 1,
    "http://wagslane.dev/path-one": 3,
  };
  const actual = sortPages(inputPages);
  const expected = [
    ["http://wagslane.dev/path-one", 3],
    ["http://wagslane.dev", 1],
  ];
  expect(actual).toEqual(expected);
});
