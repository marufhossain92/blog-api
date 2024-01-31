const asyncFileSystem = require("fs/promises");

const isUndefinedOrNull = (obj) => {
  return typeof obj === "undefined" || obj === null;
};

const cloneObject = (obj) => {
  if (isUndefinedOrNull(obj)) {
    return undefined;
  }

  const json = JSON.stringify(obj);
  const clonedObject = JSON.parse(json);

  return clonedObject;
};

const readTextFileAsync = async (filePath) => {
  try {
    const content = await asyncFileSystem.readFile(filePath, {
      encoding: "utf-8",
    });

    return content;
  } catch (error) {
    console.error(
      "An error occurred while reading the file, '" + filePath + "'.",
      error
    );
  }

  return "";
};

const writeTextFileAsync = async (content, filePath) => {
  try {
    await asyncFileSystem.writeFile(filePath, content, {
      flag: "w",
      encoding: "utf-8",
    });
  } catch (error) {
    console.error(
      "An error occurred while writing to file, '" + filePath + "'.",
      error
    );

    return false;
  }

  return true;
};

module.exports.isUndefinedOrNull = isUndefinedOrNull;
module.exports.cloneObject = cloneObject;
module.exports.readTextFileAsync = readTextFileAsync;
module.exports.writeTextFileAsync = writeTextFileAsync;
