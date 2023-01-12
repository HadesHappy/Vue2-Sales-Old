<template>
  <div>
    <p v-html="formattedString"></p>
    <span v-show="text.length > maxChars">
      <a
        :href="link"
        id="readmore"
        v-show="!isReadMore"
        v-on:click="triggerReadMore($event, true)"
        >{{ moreStr }}</a
      >
      <a
        :href="link"
        id="readmore"
        v-show="isReadMore"
        v-on:click="triggerReadMore($event, false)"
        >{{ lessStr }}</a
      >
    </span>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineProps } from "vue";

export default {
  setup() {
    const props = defineProps({
      moreStr: {
        type: String,
        default: "read more",
      },
      lessStr: {
        type: String,
        default: "",
      },
      text: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        default: "#",
      },
      maxChars: {
        type: Number,
        default: 100,
      },
    });

    const isReadMore = ref(false);

    const formattedString = () =>
      computed(() => {
        let val_container = props.text;

        if (!isReadMore.value && props.text.length > props.maxChars) {
          val_container = val_container.substring(0, props.maxChars) + "...";
        }

        return val_container;
      });

    const triggerReadMore = (e: any, b: boolean) => {
      if (props.link == "#") {
        e.preventDefault();
      }
      if (props.lessStr !== null || props.lessStr !== "") isReadMore.value = b;
    };

    return {
      formattedString,
      triggerReadMore,
      isReadMore,
      moreStr: props.moreStr,
      lessStr: props.lessStr,
      text: props.text,
      link: props.link,
      maxChars: props.maxChars,
    };
  },
};
</script>
