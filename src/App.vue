<template>
  <div class="loader" v-if="results.query.loading">Loading...</div>
  <div v-else-if="results.characters" class="containter">
    <header class="main-header">
      <img class="main-header__logo" src="./assets/img/logo.svg" alt="" />
      <Search
        :selectedOption="typeOfSort"
        @modelSearch="updateModelSearch"
        @modelSearchBy="updateModelSearchBy"
      />
    </header>
    <div class="main">
      <div class="tabs">
        <div class="tabs__buttons">
          <button
            type="button"
            class="tabs__button"
            :class="{ active: activeTabName == 'all' }"
            @click="getCharacters()"
          >
            All Characters
          </button>
          <button
            type="button"
            class="tabs__button tooltip"
            :class="{ active: activeTabName == 'favorites' }"
            @click="getFavoriteCharacters()"
          >
            <span v-if="isEmptyFavorites" class="tooltip__text">The favorite List is empty</span>
            Favorites
          </button>
        </div>
      </div>
      <div v-if="results.query.error">
        <section class="error">
          <div class="error__message">
            <div>Error: {{ results.query.error.message }}</div>

            <div>
              Go to
              <span class="error__link" @click="getCharacters()">all Characters list</span>
            </div>
          </div>
        </section>
      </div>
      <div v-else>
        <CharactersTable
          :charactersListData="results.characters"
          @update:favoritesListLength="updateIsEmptyFavorites"
        />
        <Pagination
          v-if="paginationStatus"
          :currentPage="searchByName.page"
          :pagesInfo="results.pagesInfo"
          @managePage="updatePageValue"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, ref,
} from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';

import allCharactersQuery from '@graphql/characters.query/characters.query.graphql';
import getCharactersByIdQuery from '@graphql/characters.query/getCharactersById.query.graphql';
import getCharactersByEpisodeQuery from '@graphql/characters.query/getCharactersByEpisode.query.graphql';

import Search from '@components/Search/search.vue';
import CharactersTable from '@components/CharactersTable/CharactersTable.vue';
import Pagination from '@components/Pagination/Pagination.vue';

const DEFAULT_TAB_NAME = 'all';
const FAVORITE_STORAGE_NAME = 'favoriteCharacters';
const SEARCH_BY_NAMES = {
  episode: 'episode',
  id: 'id',
  name: 'name',
};

export default defineComponent({
  name: 'App',
  components: {
    Search,
    CharactersTable,
    Pagination,
  },
  setup() {
    const searchByName = reactive({
      page: 1,
      name: '',
    });

    const searchByIDs = reactive({
      ids: '1,2,3',
    });

    const searchByEpisode = reactive({
      episode: '',
      name: '',
    });

    const results = reactive({
      query: {},
      characters: {},
      pagesTotal: 0,
      pagesInfo: {},
    });

    const isEmptyFavorites = ref(true);
    const paginationStatus = ref(true);
    const queryGql = ref();
    const variablesGql = reactive({ gql: {} });
    const typeOfSort = ref(SEARCH_BY_NAMES.name);
    const activeTabName = ref(DEFAULT_TAB_NAME);

    const updateIsEmptyFavorites = (newValue: number) => {
      isEmptyFavorites.value = !newValue;
      console.log('isEmpty', isEmptyFavorites.value);
    };

    const getCharactersByName = () => {
      const { result, loading, error } = useQuery(allCharactersQuery, searchByName);
      const pagesResult = useResult(result, [], (data) => data.characters.info);

      results.characters = useResult(result, [], (data) => data.characters.results);
      results.pagesTotal = pagesResult.value.pages;
      results.pagesInfo = pagesResult;
      results.query = { loading, error };
      paginationStatus.value = true;
    };

    const getCharactersByIds = () => {
      const { result, loading, error } = useQuery(getCharactersByIdQuery, searchByIDs);
      results.characters = useResult(result, [], (data) => data.charactersByIds);
      results.pagesTotal = 1;
      results.pagesInfo = {};
      results.query = { loading, error };
      paginationStatus.value = false;
    };

    const getCharactersByEpisode = () => {
      const { result, loading, error } = useQuery(getCharactersByEpisodeQuery, searchByEpisode);
      results.characters = useResult(result, [], (data) => data.episodes.results[0].characters);
      results.query = { loading, error };
      results.pagesInfo = {};
      paginationStatus.value = false;
    };

    const updateModelSearch = (updatedSearchValue: string) => {
      if (typeOfSort.value === SEARCH_BY_NAMES.id) {
        searchByIDs.ids = updatedSearchValue;
        queryGql.value = getCharactersByIdQuery;
        variablesGql.gql = searchByIDs;
        getCharactersByIds();
      }

      if (typeOfSort.value === SEARCH_BY_NAMES.name) {
        searchByName.name = updatedSearchValue;
        queryGql.value = allCharactersQuery;
        variablesGql.gql = searchByName;
        getCharactersByName();
      }

      if (typeOfSort.value === SEARCH_BY_NAMES.episode) {
        const [param, value] = updatedSearchValue.split(':');
        if (!value) {
          searchByEpisode.episode = param;
          searchByEpisode.name = '';
        }
        if (param === SEARCH_BY_NAMES.name) {
          searchByEpisode.name = value;
          searchByEpisode.episode = '';
        }
        if (param === SEARCH_BY_NAMES.episode) {
          searchByEpisode.episode = value;
          searchByEpisode.name = '';
        }
        queryGql.value = getCharactersByEpisodeQuery;
        variablesGql.gql = searchByEpisode;
        getCharactersByEpisode();
      }
    };

    const updateModelSearchBy = (value: string) => {
      typeOfSort.value = value;
    };

    const updatePageValue = (number: number) => {
      searchByName.page = number > results.pagesTotal ? results.pagesTotal : number;
    };

    const getCharacters = () => {
      typeOfSort.value = SEARCH_BY_NAMES.name;
      updateModelSearch('');
      activeTabName.value = 'all';
    };

    const getFavoriteCharacters = () => {
      const charactersIDs = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_NAME) as string);

      if (isEmptyFavorites.value) {
        return;
      }

      updateModelSearchBy('id');
      activeTabName.value = 'favorites';
      updateModelSearch(charactersIDs.toString());
    };

    getCharactersByName();

    return {
      results,
      updateModelSearch,
      updateModelSearchBy,
      updatePageValue,
      typeOfSort,
      paginationStatus,
      searchByName,
      getFavoriteCharacters,
      getCharacters,
      activeTabName,
      isEmptyFavorites,
      updateIsEmptyFavorites,
    };
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/base/_variables.scss';
@import '@/assets/scss/base/_breakpoints.scss';
@import '@/assets/scss/base/_fonts.scss';
@import '@/assets/scss/tooltip.scss';
@import '@/assets/scss/app.scss';
</style>
