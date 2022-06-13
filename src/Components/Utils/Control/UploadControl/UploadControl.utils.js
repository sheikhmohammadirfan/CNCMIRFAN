// Method to check if a file is already selected
export const isFileExist = (fileList, testFile) =>
  fileList.find(
    (file) =>
      file.name === testFile.name && file.lastModified === testFile.lastModified
  ) !== undefined;

// Method to add newly selected files in given state
export const addFiles = (isMultiple, currFiles, changeInput, changeState) => {
  // if mode is single file, then directly update input field
  if (!isMultiple) return changeInput(currFiles[0]);

  // List to store on those file, which are not selected
  const uniqueFileList = [];
  // Populate unique file
  changeState((prevFiles) => {
    for (let file of currFiles)
      if (!isFileExist(prevFiles, file)) uniqueFileList.push(file);
    return prevFiles;
  });

  // Check if any unique file is selected then only update the state
  if (uniqueFileList.length > 0)
    changeState((prevFile) => [...prevFile, ...uniqueFileList]);
};

// Remove file at specific index
export const removeFileAtIndex = (index, changeState) =>
  changeState((file) => {
    const newVal = file.filter((_, idx) => idx !== index);
    return newVal;
  });

// Remove all selected files by input field
export const removeAllFiles = (changeState) => changeState([]);
