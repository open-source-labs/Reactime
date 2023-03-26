export default function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  const copy = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'function') {
      copy[key] = obj[key];
    } else {
      copy[key] = deepCopy(obj[key]);
    }
  });
  return copy as T;
}
