const emptyAsyncStorage = {
  clear: async () => undefined,
  getAllKeys: async () => [],
  getItem: async () => null,
  mergeItem: async () => undefined,
  multiGet: async () => [],
  multiRemove: async () => undefined,
  multiSet: async () => undefined,
  removeItem: async () => undefined,
  setItem: async () => undefined
};

module.exports = emptyAsyncStorage;
