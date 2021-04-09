<template>
  <nav>
    <ul class="pagination">
      <li class="pagination__item">
        <button
          type="button"
          class="pagination__button prev"
          @click="setPaginationNumber(pagesInfo.prev)"
        >
          <div class="pagination__button-icon"></div>
        </button>
      </li>
      <li class="pagination__item">
        <button
          type="button"
          class="pagination__button"
          v-for="pageNumber in currentPages"
          :key="pageNumber"
          :class="returnActiveClass(pageNumber)"
          @click="setPaginationNumber(pageNumber)"
        >
          {{ returnPaginationValue(pageNumber) }}
        </button>
      </li>
      <li class="pagination__item">
        <button
          type="button"
          class="pagination__button next"
          @click="setPaginationNumber(pagesInfo.next)"
        >
          <div class="pagination__button-icon"></div>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "Pagination",
  components: {},
  props: {
    pagesInfo: {
      type: Object,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const pageNumber = ref(1);

    const currentPages = computed(() => {
      const arrayOfAllPages = Array.from({ length: props.pagesInfo.pages }, (v, k) => k + 1);

      const range = { start: 0, end: 0 };

      if (!props.pagesInfo.prev) {
        range.start = 0;
        range.end = 4;
      } else if (
        props.pagesInfo.prev &&
        props.pagesInfo.next &&
        props.pagesInfo.next + 1 <= props.pagesInfo.pages
      ) {
        range.start = props.pagesInfo.prev - 1;
        range.end = props.pagesInfo.next + 1;
      } else {
        range.start = props.pagesInfo.pages - 4;
        range.end = props.pagesInfo.pages;
      }

      const selectedPages = arrayOfAllPages.slice(range.start, range.end);

      if (props.pagesInfo.prev && props.pagesInfo.prev >= 2) {
        selectedPages.unshift(1, 0);
      }

      if (props.pagesInfo.next && props.pagesInfo.next + 2 <= props.pagesInfo.pages) {
        selectedPages.push(0, props.pagesInfo.pages);
      }
      return selectedPages;
    });
    const returnActiveClass = (pageId: number) => (props.currentPage === pageId ? "active" : "");
    const returnPaginationValue = (value: number) => (value !== 0 ? value : "...");
    const setPaginationNumber = (value: number) => {
      if (!value) {
        return;
      }
      pageNumber.value = value;
      emit("managePage", pageNumber.value);
    };

    return {
      setPaginationNumber,
      currentPages,
      returnPaginationValue,
      returnActiveClass,
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/base/_variables.scss";
@import "@/assets/scss/base/_breakpoints.scss";
@import "@/assets/scss/base/_fonts.scss";
@import "./pagination.scss";
</style>
