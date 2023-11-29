<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { setTitle } from "@/hooks/usePageToolkits";
import type {GuestList, PeopleKey} from "@/apis/PeopleModels";

import BodyBlock from "@/components/blocks/BodyBlock.vue";
import TitleBlock from "@/components/blocks/TitleBlock.vue";
import Markdown from "@/components/markdown/Markdownworker.vue";
import PlaceholderBlock from "@/components/blocks/PlaceholderBlock.vue";

setTitle("pmc", "i18n");

const guestList = reactive<PeopleKey[]>([]);

const loadGuestListAsync = async () => {
  const list = await import (/* @vite-ignore */"@/apis/guests.json");
  const people = list as unknown as GuestList;
  return people.people;
};

onMounted(() => {
  loadGuestListAsync().then(list => {
    guestList.splice(0, guestList.length, ...list);
  });
});
</script>

<template>

  <body-block>

    <placeholder-block height="20px" />

    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-5">

      <div v-for="people in guestList.sort((x, y) => x.id.localeCompare(y.id))"
           :key="people.id"
           :title="people.name"
           class="text-center relative cursor-pointer">
        <img :src="`/images/people/${people.avatar}`" :alt="people.name" class="w-24 h-24 rounded-full mx-auto" />
        <span class="inline-block p-3">{{ people.name }}</span>
      </div>

    </div>

  </body-block>

</template>

<style scoped lang="css">

</style>