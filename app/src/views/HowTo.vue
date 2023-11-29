<script setup lang="ts">
import MarkdownWorker from "@/components/markdown/MarkdownWorker.vue";
import PlaceholderBlock from "@/components/blocks/PlaceholderBlock.vue";
</script>

<template>

  <div class="content-paper relative">

    <markdown-worker source="pages/how-to"
                     :i18n="true"
                     fallback-locale="en"
                     :include-file-extension="true"
                     file-extension=".md"
                     :redirect-to404="false"/>
  </div>

  <placeholder-block height="90px"/>

</template>

<style scoped lang="css">

</style>