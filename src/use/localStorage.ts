import { ref } from "vue";

const storageData = ref<number[]>([]);

function useReturnLocalStorageData(): any {
  return storageData;
}

function useGetLocalStorage(localStorageName: string): string {
  return JSON.parse(localStorage.getItem(localStorageName) as string);
}

function useLocalStorageExists(localStorageName: string): boolean {
  return Boolean(localStorage.getItem(localStorageName));
}

function useSetLocalStorage(localStorageName: string, data: unknown): void {
  localStorage.setItem(localStorageName, JSON.stringify(data));
}

function useAddItemToLocalStorage(id: number): void {
  storageData.value = [...storageData.value, id];
}

function useRemoveItemFromLocalStorage(id: number): void {
  storageData.value = storageData.value.filter((elem: number) => elem !== id);
}

function useLocaStorageItemExists(id: number): boolean {
  return Boolean(storageData.value.find((element: number) => element === id));
}

function useRemoveLocalStorage(localStorageName: string): void {
  localStorage.removeItem(localStorageName);
}

export {
  useReturnLocalStorageData,
  useGetLocalStorage,
  useLocalStorageExists,
  useLocaStorageItemExists,
  useSetLocalStorage,
  useAddItemToLocalStorage,
  useRemoveItemFromLocalStorage,
  useRemoveLocalStorage,
};
