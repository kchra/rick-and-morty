/* eslint-disable import/no-unresolved */
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
        :isFavorite="isFavorite(character.id)"
        v-bind="character"
        @update:isFavorite="manageFavorites"
      >
      </CharactersTableRow>
    </tr>
  </table>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, PropType, ref, watch,
} from 'vue';

import { CharactersInterface } from '@types';
import CharactersTableRow from './CharactersTableRow.vue';

const FAVORITE_STORAGE_NAME = 'favoriteCharacters';

export default defineComponent({
  name: 'CharactersTable',
  components: { CharactersTableRow },
  props: {
    charactersListData: {
      type: Object as PropType<CharactersInterface>,
    },
  },
  setup(props, { emit }) {
    const favoritesList = ref<number[]>([]);
    const isFavorite = (id: number) => favoritesList.value.find((element) => element === id);
    const isStorage = () => localStorage.getItem(FAVORITE_STORAGE_NAME);
    const openStorage = () => JSON.parse(localStorage.getItem(FAVORITE_STORAGE_NAME) as string);
    const removeStorage = () => localStorage.removeItem(FAVORITE_STORAGE_NAME);
    const removeItem = (id: number) => favoritesList.value.filter((elem: number) => elem !== id);
    const saveStorage = (data: unknown) => {
      localStorage.setItem(FAVORITE_STORAGE_NAME, JSON.stringify(data));
    };

    const manageFavorites = (id: number) => {
      favoritesList.value = !isFavorite(id)
        ? (favoritesList.value = [...favoritesList.value, id])
        : removeItem(id);
    };

    onMounted(() => {
      if (isStorage()) {
        try {
          favoritesList.value = openStorage();
        } catch (error) {
          removeStorage();
        }
      } else {
        saveStorage(favoritesList.value);
      }
    });

    watch(favoritesList, (newValue) => {
      saveStorage(newValue);
      emit('update:favoritesListLength', favoritesList.value.length);
    });

    return { isFavorite, manageFavorites };
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/base/_variables.scss';
@import '@/assets/scss/base/_breakpoints.scss';
@import '@/assets/scss/base/_fonts.scss';
@import './charactersTable.scss';
</style>
