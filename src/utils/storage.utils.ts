export const STORE_PREFIX = 'kvlm-';

export function storeValue(key: string, value: string, adapter: Storage = localStorage) {
  adapter.setItem(`${STORE_PREFIX}${key}`, value);
}

export function retrieveValue(key: string, adapter: Storage = localStorage): string | undefined {
  return adapter.getItem(`${STORE_PREFIX}${key}`) ?? undefined;
}
