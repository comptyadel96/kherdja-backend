// myModule.test.js
import myModule from "../myModule"
import { test, expect } from "vitest"
test("adds 1 + 2 to equal 3", () => {
  expect(myModule.sum(1, 2)).toBe(3)
})

