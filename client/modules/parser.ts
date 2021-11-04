const getProperty = (
  object: { [key: string]: any } | null | undefined,
  propertyPath: string
): any => {
  if (!object) return undefined;

  let result = object;
  const propertyArray = propertyPath.split(".");
  for (let i = 0; i <= propertyArray.length - 1; i += 1) {
    if (propertyArray[i] === "") {
      return undefined;
    }
    if (typeof result[propertyArray[i]] === "undefined") {
      return undefined;
    }
    result = result[propertyArray[i]];
  }
  return result;
};

export { getProperty };
