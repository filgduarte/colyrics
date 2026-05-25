export function parseMetaLine(meta) {
  const index = meta.indexOf(":");

  if (index === -1) {
    return {
      key: null,
      value: meta.trim()
    };
  }

  const key = meta.slice(0, index).trim();
  const value = meta.slice(index + 1).trim();

  return {
    key,
    value
  };
}