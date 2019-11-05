const fail = () => {
  throw Error(
    'Native handler was not registered, you should import stream-chat-expo or stream-chat-react-native',
  );
};
export let NetInfo = {
  fetch: fail,
  addEventListener: fail,
};
export let pickImage = fail;
export let pickDocument = fail;
export let AsyncStorage = fail;
export let storage = fail;

export const registerNativeHandlers = (handlers) => {
  if (handlers.NetInfo) {
    NetInfo = handlers.NetInfo;
  }

  if (handlers.pickImage) {
    pickImage = handlers.pickImage;
  }

  if (handlers.pickDocument) {
    pickDocument = handlers.pickDocument;
  }

  if (handlers.AsyncStorage) {
    AsyncStorage = handlers.AsyncStorage;
  }

  if (handlers.storage) {
    storage = handlers.storage;
  }
};
