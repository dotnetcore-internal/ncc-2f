<script setup lang="ts">
import {computed} from "vue";
import {useUiStore} from "@/stores/uiStore";
import {jumpTimeStamp} from "@/hooks/useMedia";
import type {EpisodeProfileModel} from "@/apis/ContentModels";

const uiStore = useUiStore();

const props = withDefaults(defineProps<{
  metadata: EpisodeProfileModel
}>(), {});

const hasTimeStamp = computed(() => {
  return !!props.metadata.timestamp && props.metadata.timestamp.length > 0;
});

const useTimeStamp = computed(() => {
  return props.metadata.timestamp;
});

const changeTimeStamp = (second: string | number) => {
  if (uiStore.currentMedia !== 'none') {
    jumpTimeStamp(second, uiStore.currentMedia);
  }
}

</script>

<template>

  <div class="p-5" v-if="hasTimeStamp">

    <div v-for="(item, i) in useTimeStamp" :key="i" class="flex gap-4">
      <a class="block flex-none w-12 text-right text-sky-600 hover:text-sky-900 font-mono underline hover:underline underline-offset-2"
         @click.prevent="changeTimeStamp(item.stamp)">
        {{ item.displayTime }}
      </a>
      <span class="block flex-1"> {{ item.content }} </span>
    </div>

  </div>

</template>

<style scoped lang="css">

</style>