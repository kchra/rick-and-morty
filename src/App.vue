<template>
  <div class="loader" v-if="results.query.loading">Loading...</div>
  <div v-else-if="results.characters" class="containter">
    <header class="main-header">
      <img class="main-header__logo" src="./assets/img/logo.svg" alt="" />
      <Search
        :selectedOption="sortTypeName"
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
          v-if="isPagination"
          :currentPage="searchByName.page"
          :pagesInfo="results.pagesInfo"
          @managePage="updatePageValue"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, provide } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";

import allCharactersQuery from "@graphql/characters.query/characters.query.graphql";
import getCharactersByIdQuery from "@graphql/characters.query/getCharactersById.query.graphql";
import getCharactersByEpisodeQuery from "@graphql/characters.query/getCharactersByEpisode.query.graphql";

import Search from "@components/Search/search.vue";
import CharactersTable from "@components/CharactersTable/CharactersTable.vue";
import Pagination from "@components/Pagination/Pagination.vue";

import {
  SearchByNameInterface,
  SearchByIDsInterface,
  searchByEpisodeInterface,
  ResultsInterface,
} from "@types";

import SETTINGS from "./constans/settings";

const { key } = Object.values(SETTINGS.tabs).find((value) => value.default);
const DEFAULT_TAB_NAME: string = key;

export default defineComponent({
  name: "App",
  components: {
    Search,
    CharactersTable,
    Pagination,
  },
  setup() {
    const searchByName = reactive<SearchByNameInterface>({
      page: 1,
      name: "",
    });

    const searchByIDs = reactive<SearchByIDsInterface>({
      ids: "1,2,3",
    });

    const searchByEpisode = reactive<searchByEpisodeInterface>({
      episode: "",
      name: "",
    });

    const results = reactive<ResultsInterface>({
      query: {},
      characters: {},
      pagesTotal: 0,
      pagesInfo: {},
    });

    const isEmptyFavorites = ref<boolean>(true);
    const isPagination = ref<boolean>(true);
    const sortTypeName = ref<string>(SETTINGS.searchBy.name);
    const activeTabName = ref<string>(DEFAULT_TAB_NAME);

    provide("localStorageName", SETTINGS.favoritesStoreName);

    const updateIsEmptyFavorites = (newValue: number) => {
      isEmptyFavorites.value = !newValue;
    };

    const getCharactersByName = () => {
      const { result, loading, error } = useQuery(allCharactersQuery, searchByName);
      const pagesResult = useResult(result, [], (data) => data.characters.info);

      results.characters = useResult(result, [], (data) => data.characters.results);
      results.pagesTotal = pagesResult.value.pages;
      results.pagesInfo = pagesResult;
      results.query = { loading, error };
      isPagination.value = true;
    };

    const getCharactersByIds = () => {
      const { result, loading, error } = useQuery(getCharactersByIdQuery, searchByIDs);
      results.characters = useResult(result, [], (data) => data.charactersByIds);
      results.pagesTotal = 1;
      results.pagesInfo = {};
      results.query = { loading, error };
      isPagination.value = false;
    };

    const getCharactersByEpisode = () => {
      const { result, loading, error } = useQuery(getCharactersByEpisodeQuery, searchByEpisode);
      results.characters = useResult(result, [], (data) => data.episodes.results[0].characters);
      results.query = { loading, error };
      results.pagesInfo = {};
      isPagination.value = false;
    };

    const updateModelSearch = (updatedSearchValue: string) => {
      if (sortTypeName.value === SETTINGS.searchBy.id) {
        searchByIDs.ids = updatedSearchValue;
        getCharactersByIds();
      }

      if (sortTypeName.value === SETTINGS.searchBy.name) {
        searchByName.name = updatedSearchValue;
        getCharactersByName();
      }

      if (sortTypeName.value === SETTINGS.searchBy.episode) {
        const [param, value] = updatedSearchValue.split(":");
        if (!value) {
          searchByEpisode.episode = param;
          searchByEpisode.name = "";
        }
        if (param === SETTINGS.searchBy.name) {
          searchByEpisode.name = value;
          searchByEpisode.episode = "";
        }
        if (param === SETTINGS.searchBy.episode) {
          searchByEpisode.episode = value;
          searchByEpisode.name = "";
        }
        getCharactersByEpisode();
      }
    };

    const updateModelSearchBy = (value: string) => {
      sortTypeName.value = value;
    };

    const updatePageValue = (number: number) => {
      searchByName.page = number > results.pagesTotal ? results.pagesTotal : number;
    };

    const getCharacters = () => {
      sortTypeName.value = SETTINGS.searchBy.name;
      activeTabName.value = SETTINGS.tabs.all.key;
      updateModelSearch("");
    };

    const getFavoriteCharacters = () => {
      const charactersIDs = JSON.parse(localStorage.getItem(SETTINGS.favoritesStoreName) as string);

      if (isEmptyFavorites.value) {
        return;
      }

      updateModelSearchBy(SETTINGS.searchBy.id);
      activeTabName.value = SETTINGS.tabs.favorites.key;
      updateModelSearch(charactersIDs.toString());
    };

    getCharactersByName();

    return {
      results,
      updateModelSearch,
      updateModelSearchBy,
      updatePageValue,
      sortTypeName,
      isPagination,
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
@import "@/assets/scss/base/_variables.scss";
@import "@/assets/scss/base/_breakpoints.scss";
@import "@/assets/scss/base/_fonts.scss";
@import "@/assets/scss/tooltip.scss";
@import "@/assets/scss/app.scss";
</style>
