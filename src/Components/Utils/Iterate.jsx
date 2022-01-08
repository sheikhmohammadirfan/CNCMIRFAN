export const Iterate = (field, name, formData) => {
  for (let i = 0; i < field.length; i++) {
    formData.append(name, field[i]);
  }
  return formData;
};
