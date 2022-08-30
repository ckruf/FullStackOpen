// jest expects the names of test files to include ".test", so we include the
// ".test.js" extension for all our tests 

const reverse = require("../utils/for_testing").reverse;


// test cases are defined with the 'test' function
// its first argument is a string description of the test
// its second argument is a function which defines the test case
test("reverse of a", () => {
    const result = reverse("a");

    expect(result).toBe("a");
});

test("reverse of react", () => {
    const result = reverse("react");

    expect(result).toBe("tcaer");
});

test("reverse of releveler", () => {
    const result = reverse("releveler");

    expect(result).toBe("releveler");
});
