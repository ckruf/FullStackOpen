const average = require("../utils/for_testing").average;


// here we are using a 'describe' block to group tests together into a logical collection
// the advantage of this will become more apparent when we need to run shared setup and teardown
// operations for a group of tests
describe("average", () => {
    test("of one value is the value itself", () => {
        expect(average([1])).toBe(1);
    });

    test("of many is calculated right", () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });

    test("of empty array is zero", () => {
        expect(average([])).toBe(0);
    });
});
