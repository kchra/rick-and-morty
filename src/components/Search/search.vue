<template>
  <section class="search">
    <div class="search__label">Search by</div>
    <VueSelect
      v-model="searchBy"
      :options="options"
      label-by="name"
      class="search__dropdown"
      close-on-select
    />

    <input class="search__field" type="text" v-model="search" placeholder="Search..." />
    <button
      @click="submitSearch"
      :disabled="isEmptySearchValue"
      :class="{ disabled: isEmptySearchValue }"
      class="search__button material-icons"
    >
      search
    </button>
  </section>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, watch,
} from 'vue';
import VueSelect from 'vue-next-select';
import find from 'lodash/find';

export default defineComponent({
  name: 'Search',
  components: { VueSelect },
  props: {
    selectedOption: { type: String },
  },
  setup(props, { emit }) {
    const options = ref([
      { name: 'Name', value: 'name' },
      { name: 'Identifier', value: 'id' },
      { name: 'Episode', value: 'episode' },
    ]);

    const searchBy = ref(find(options.value, { value: props.selectedOption }));
    const search = ref(null);

    const isEmptySearchValue = computed(() => !search.value);
    const submitSearch = () => {
      emit('modelSearch', search.value);
    };

    watch(searchBy, (currentSearchBy) => {
      emit('modelSearchBy', currentSearchBy.value);
    });

    return {
      search,
      options,
      searchBy,
      submitSearch,
      isEmptySearchValue,
    };
  },
});
</script>

<style lang="scss">
@import '../../../node_modules/vue-next-select/dist/index.min.css';
@import '@/assets/scss/base/_variables.scss';
@import '@/assets/scss/base/_fonts.scss';
@import '@/assets/scss/base/_breakpoints.scss';
@import './search.scss';
@import './searchByDropdown.scss';
</style>
