<template>
  <small class="maxlength-message is-valid">
    {{ textLength }}/{{ props.maxlength }} caractère{{
      props.maxlength && props.maxlength > 1 ? "s" : ""
    }}
  </small>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: String,
    require: true,
  },
  maxlength: {
    type: Number,
    require: true,
  },
});

const textLength = computed(() => {
  return props.value ? props.value.length : 0;
});
</script>
