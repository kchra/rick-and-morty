<template>
  <td class="table__item first"></td>
  <td class="table__item" data-th="Photo">
    <div class="table__item-crop">
      <img class="table__item-img" :src="image" alt="" />
    </div>
  </td>
  <td class="table__item" data-th="Character ID">{{ id }}</td>
  <td class="table__item" data-th="Name">{{ name }}</td>
  <td class="table__item" data-th="Gender">
    <div class="gender__container">
      <span class="material-icons gender__icon">{{ genderIcons[gender] }}</span>
      <span class="gender__name">{{ gender }}</span>
    </div>
  </td>
  <td class="table__item" data-th="Species">{{ species }}</td>
  <td class="table__item" data-th="Last episode">{{ episode[episode.length - 1].episode }}</td>
  <td class="table__item" data-th="Add to Favorite">
    <button @click="favorite = id" class="material-icons favorite__button" :class="favorite">
      star
    </button>
  </td>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'CharactersTableRow',
  props: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String, required: true },
    episode: { type: Array },
    isFavorite: { type: Boolean },
  },
  setup(props, { emit }) {
    const favorite = computed({
      get: () => (props.isFavorite ? 'active' : ''),
      set: (value) => emit('update:isFavorite', value),
    });

    const genderIcons = {
      Male: 'male',
      Female: 'female',
      unknown: 'remove',
      Genderless: 'close',
    };

    return { favorite, genderIcons };
  },
});
</script>

<style lang="scss">
@import '@/assets/scss/base/_variables.scss';
@import '@/assets/scss/base/_breakpoints.scss';
@import '@/assets/scss/base/_fonts.scss';
@import './charactersTableRow.scss';
</style>
