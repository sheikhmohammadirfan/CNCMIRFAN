// method to check for valid password
export const isPasswordValid = (pass, invalidMessage) => {
  if (invalidMessage) {
    if (
      pass &&
      !pass.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*-+|<>,.?])[\w~`!@#$%^&*-+|<>,.?]{8,15}$/
      )
    )
      return invalidMessage;
    return true;
  }

  // Check if password is not set
  if (pass === undefined) return true;
  // Check for number in password
  if (!pass.match(/\d/)) return "Password should atleast have a number.";
  // Check for lower case char in password
  if (!pass.match(/[a-z]/))
    return "Password should atleast have a small alphabet(a-z).";
  // Check for upper case char in password
  if (!pass.match(/[A-Z]/))
    return "Password should atleast have a Capital alphabet(A-Z).";
  // Check for symbols in password
  if (!pass.match(/[~`!@#$%^&*-+|<>,.?]/))
    return "Password should atleast have a Special character( ~`!@#$%^&*-+|<>,.?).";
  // Check for spaces in password
  if (pass.includes(" ")) return "Password cannot contain spaces in it.";
  // Check for password length
  if (pass.length < 8 || pass.length > 15)
    return "Password should have 8-15 characters.";
  return true;
};

// Get label, if single space is passed the return empty
export const getLabel = (label, name) => (label === " " ? "" : label || name);

// Get error message from error or control.error
export const getError = (error1, error2, gutter) =>
  error1 ? error1 : error2 ? error2.message : gutter ? " " : "";
