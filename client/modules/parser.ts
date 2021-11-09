const getProperty = (
  object: { [key: string]: any } | null | undefined,
  propertyPath: string
): any => {
  if (!object) return undefined;

  let result = object;
  const propertyArray = propertyPath.split(".");
  for (let i = 0; i < propertyArray.length; i++) {
    if (propertyArray[i] === "") return undefined;

    const currentValue = result[propertyArray[i]];
    if (typeof currentValue === "undefined") return undefined;
    else if (currentValue === null) return null;

    result = currentValue;
  }
  return result;
};

export { getProperty };
