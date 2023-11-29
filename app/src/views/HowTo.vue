<script setup lang="ts">

import MarkdownWorker from "@/components/markdown/MarkdownWorker.vue";
</script>

<template>

  <markdown-worker source="pages/how-to"
                   :i18n="true"
                   fallback-locale="en"
                   :include-file-extension="true"
                   file-extension=".md"
                   :redirect-to404="false" />

</template>

<style scoped lang="css">

</style>