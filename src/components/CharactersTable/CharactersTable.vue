<template>
  <table class="characters">
    <tr class="table__titles-container">
      <th class="table__title first"></th>
      <th class="table__title">Photo</th>
      <th class="table__title">Character ID</th>
      <th class="table__title">Name</th>
      <th class="table__title">Gender</th>
      <th class="table__title">Species</th>
      <th class="table__title">Last Episode</th>
      <th class="table__title">Add to Favorites</th>
    </tr>
    <tr class="table__items-container" v-for="character in charactersListData" :key="character.id">
      <CharactersTableRow
        :isFavorite="useLocaStorageItemExists(character.id)"
        v-bind="character"
        @update:isFavorite="manageFavorites"
      >
      </CharactersTableRow>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, PropType, watch } from "vue";

import { CharactersInterface } from "@types";
import {
  useReturnLocalStorageData,
  useGetLocalStorage,
  useSetLocalStorage,
  useLocaStorageItemExists,
  useAddItemToLocalStorage,
  useRemoveItemFromLocalStorage,
  useRemoveLocalStorage,
  useLocalStorageExists,
} from "../../use/localStorage";

import CharactersTableRow from "./CharactersTableRow.vue";

export default defineComponent({
  name: "CharactersTable",
  components: { CharactersTableRow },
  props: {
    charactersListData: {
      type: Object as PropType<CharactersInterface>,
    },
  },
  setup(props, { emit }) {
    const localStorageName = inject("localStorageName") as string;
    const storageData = useReturnLocalStorageData();

    const manageFavorites = (id: number) => {
      !useLocaStorageItemExists(id)
        ? useAddItemToLocalStorage(id)
        : useRemoveItemFromLocalStorage(id);
    };

    onMounted(() => {
      if (!useLocalStorageExists(localStorageName)) {
        try {
          useSetLocalStorage(localStorageName, storageData.value);
        } catch {
          useRemoveLocalStorage(localStorageName);
        }
      } else {
        storageData.value = useGetLocalStorage(localStorageName);
      }
    });

    watch(storageData, (newValue) => {
      useSetLocalStorage(localStorageName, newValue);
      emit("update:favoritesListLength", storageData.value.length);
    });

    return { useLocaStorageItemExists, manageFavorites };
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/base/_variables.scss";
@import "@/assets/scss/base/_breakpoints.scss";
@import "@/assets/scss/base/_fonts.scss";
@import "./charactersTable.scss";
</style>
