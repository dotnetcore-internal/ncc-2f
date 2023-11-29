<script setup lang="ts">
import MarkdownWorker from "@/components/markdown/MarkdownWorker.vue";
import PlaceholderBlock from "@/components/blocks/PlaceholderBlock.vue";
import TitleBlock from "@/components/blocks/TitleBlock.vue";
import Anchor from "@/components/basic/AnchorElement.vue";
</script>

<template>

  <div class="content-paper relative">

  <markdown-worker source="pages/about-2f"
                   :i18n="true"
                   fallback-locale="en"
                   :include-file-extension="true"
                   file-extension=".md"
                   :redirect-to404="false" />
  </div>

  <div class="content-paper relative">

    <title-block :with-placeholder="false" :is-font-black="false">
      {{ $t('who-we-are') }}
    </title-block>

    <div class="who-we-are-desc">
      {{ $t("who-we-are-desc") }}
    </div>

    <anchor href="https://ncc.work/about/who-we-are" :title="$t('who-we-are')" target="_blank" mode="classic" class="who-we-are">
      {{ $t('who-we-are') }}
    </anchor>

  </div>

  <placeholder-block height="90px"/>

</template>

<style scoped lang="css">
.who-we-are-desc {
  @apply p-5;
}

.who-we-are {
  @apply py-2 w-72 mx-auto my-4 block;
  @apply bg-slate-500/10 hover:bg-slate-500/20 rounded-lg cursor-pointer;
  @apply text-lg text-center;
}
</style>