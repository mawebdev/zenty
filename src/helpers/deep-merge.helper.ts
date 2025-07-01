export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceVal = source[key as keyof T];
    const targetVal = target[key as keyof T];

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      output[key as keyof T] = deepMerge(targetVal, sourceVal);
    } else {
      output[key as keyof T] = sourceVal as T[keyof T];
    }
  });
  return output;
}
