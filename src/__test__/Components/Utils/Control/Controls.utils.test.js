import {
  getError,
  getLabel,
  isPasswordValid,
} from "../../../../Components/Utils/Control/Controls.utils.js";

describe("isPasswordValid()", () => {
  describe("invaildMessage is set", () => {
    const invaildMessage = "This password is invaild.";
    const checker = (pass) => isPasswordValid(pass, invaildMessage);

    test("Test method returns true, if value is undefined", () => {
      expect(checker()).toBe(true);
    });

    test("Test for valid password", () => {
      expect(checker("Irshad!123")).toBe(true);
    });

    test("Test for invalid password cases", () => {
      // No digits
      expect(checker("Irshad***")).toBe(invaildMessage);
      // No special Characters
      expect(checker("Irshad123")).toBe(invaildMessage);
      // No lower-case alphabets
      expect(checker("IRSHAD*123")).toBe(invaildMessage);
      // No upper-case alphabets
      expect(checker("irshad*123")).toBe(invaildMessage);
      // Space in password
      expect(checker("Irshad *1")).toBe(invaildMessage);
    });

    test("Test for invalid length of password", () => {
      expect(checker("IRSh1*")).toBe(invaildMessage);
      expect(checker("IRShad@12345678*")).toBe(invaildMessage);
    });
  });

  describe("invaildMessage is  not set", () => {
    test("Test method returns true, if value is undefined", () => {
      expect(isPasswordValid()).toBe(true);
    });

    test("Test for valid password", () => {
      expect(isPasswordValid("Irshad!123")).toBe(true);
    });

    test("Test for invalid password cases", () => {
      // No digits
      expect(isPasswordValid("Irshad***")).toEqual(expect.any(String));
      // No special Characters
      expect(isPasswordValid("Irshad123")).toEqual(expect.any(String));
      // No lower-case alphabets
      expect(isPasswordValid("IRSHAD*123")).toEqual(expect.any(String));
      // No upper-case alphabets
      expect(isPasswordValid("irshad*123")).toEqual(expect.any(String));
      // Space in password
      expect(isPasswordValid("Irshad *1")).toEqual(expect.any(String));
    });

    test("Test for invalid length of password", () => {
      expect(isPasswordValid("IRSh1*")).toEqual(expect.any(String));
      expect(isPasswordValid("IRShad@12345678*")).toEqual(expect.any(String));
    });
  });
});

describe("getLabel()", () => {
  test("Test when label is passed, method returns label", () => {
    expect(getLabel("label", "name")).toBe("label");
  });

  test("Test when label is single space, method returns empty string", () => {
    expect(getLabel(" ", "name")).toBe("");
  });

  test("Test when label is empty, method returns name", () => {
    expect(getLabel("", "name")).toBe("name");
  });
});

describe("getError()", () => {
  test("Test when no error is passed & gutter is set, method returns single space", () => {
    expect(getError(null, null, true)).toBe(" ");
  });

  test("Test when no error is passed & gutter is unset, method returns empty string", () => {
    expect(getError(null, null, false)).toBe("");
  });

  test("Test when 1st error is passed then error is returned", () => {
    expect(getError("error 1", null, true)).toBe("error 1");
  });

  test("Test when 2st error obj is passed then error message is returned", () => {
    expect(getError(null, { message: "error 2" }, true)).toBe("error 2");
  });
});
