import { computed } from 'vue';

function useModelWrapper(props, emit, name = 'modelValue') {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  });
}

export default useModelWrapper;
