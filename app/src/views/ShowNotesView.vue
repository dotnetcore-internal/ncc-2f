<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {useDateFormat, usePreferredDark} from "@vueuse/core";
import {useRoute, useRouter} from "vue-router";
import {useEmitter} from "@/hooks/useEmitter";
import {useUiStore} from "@/stores/uiStore";
import {setTitle} from "@/hooks/usePageToolkits";
import {jumpTimeStamp} from "@/hooks/useMedia";
import {queryEpisodeMetadata} from "@/apis/QueryEpicodeMetadataApi";
import type {EpisodeProfileModel} from "@/apis/ContentModels";

import Markdown from "@/components/markdown/MarkdownWorker.vue";
import BodyBlock from "@/components/blocks/BodyBlock.vue";
import Anchor from "@/components/basic/AnchorElement.vue";
import TitleBlock from "@/components/blocks/TitleBlock.vue";
import ArticleAuthors from "@/components/articles/ArticleAuthors.vue";
import ArticleCardsAuthors from "@/components/articles/ArticleCardsAuthors.vue";
import MediaShell from "@/components/media/MediaShell.vue";

import {ArrowLeft} from "@icon-park/vue-next";
import WaveLoading from "@/components/basic/WaveLoading.vue";

const route = useRoute();
const router = useRouter();
const emitter = useEmitter();
const uiStore = useUiStore();

const currentLocale = ref(uiStore.locale);

const articleId = computed(() => {
  const params = route.params.pathMatch as [];
  return params.join("/");
});

const articleMetadata = reactive<EpisodeProfileModel>({} as EpisodeProfileModel);
const articleMetadataLoaded = ref(false);

const prefaceSource = computed(() => {
  return `show-notes/${articleId.value}/preface`;
});

const contentSource = computed(() => {
  return `show-notes/${articleId.value}/content`;
});

const loadEpisodeMetadataAsync = async (locale?: string) => {
  const targetLocale = locale ?? currentLocale.value;
  const api = `/content/show-notes/${articleId.value}/metadata.${targetLocale}.json`;
  await queryEpisodeMetadata(api, (data) => {
    articleMetadata.id = data.id;
    articleMetadata.title = data.title;
    articleMetadata.date = data.date;
    articleMetadata.author = data.author;
    articleMetadata.img = data.img;
    articleMetadata.url = data.url;
    articleMetadata.bvid = data.bvid;
    articleMetadata.yid = data.yid;
    articleMetadata.timestamp = data.timestamp;
    setTitle(articleMetadata.title, "direct");
    articleMetadataLoaded.value = true;
  });
};

//region Media

const hasMediaTimeStamp = computed(() => {
  return articleMetadataLoaded.value && !!articleMetadata.timestamp && articleMetadata.timestamp.length > 0;
});

const useMediaTimeStamp = computed(()=>{
  return articleMetadata.timestamp;
});

const changeMediaTimeStamp = (second: string | number) => {
  if (uiStore.currentMedia !== 'none') {
    jumpTimeStamp(second, uiStore.currentMedia);
  }
}

//endregion

//region Article title, date and author

const useArticleTitle = computed(() => {
  return articleMetadata.title;
});

const useArticleDate = computed(() => {
  return articleMetadata.date;
});

const useAuthor = computed(() => {
  return articleMetadata.author;
});

const displayDate = (date: Date, format: string) => {
  return useDateFormat(date, format, {locales: uiStore}).value;
};

//endregion

//region SVG Style

const currentPrefersDarkMode = usePreferredDark();
const useIconColor = computed(() => {
  return currentPrefersDarkMode.value
      ? "#f8f8f8"
      : "#000000";
});

//endregion

onMounted(async () => {

  emitter.on("toChangeLocale", async (e) => {
    const event = e as { locale: string };
    currentLocale.value = event.locale;
    try {
      await loadEpisodeMetadataAsync(event.locale);
      emitter.emit("toRerenderMarkdown", {source: contentSource.value, locale: event.locale});
    } catch {
      await router.push({path: `/404`});
    }
  });

  await loadEpisodeMetadataAsync();
});

onUnmounted(() => {
  emitter.off("toChangeLocale");
});
</script>

<template>

  <body-block v-if="articleMetadataLoaded">

    <media-shell :metadata="articleMetadata"/>

  </body-block>
  <wave-loading v-else/>

  <body-block>

    <div class="content-paper relative">

      <div class="absolute top-10 left-5">
        <anchor href="/show-notes" route-name="home" :title="$t('home')" mode="h5">
          <arrow-left theme="filled" size="36" :fill="useIconColor"/>
        </anchor>
      </div>

      <div class="text-center w-10/12 mx-auto lg:w-4/6 xl:1/2">

        <title-block :with-placeholder="false" :is-font-black="false">
          {{ useArticleTitle }}
        </title-block>

        <article-authors :author="useAuthor"/>

        <div class="px-5 pt-1 text-sm text-gray-500">
          {{ displayDate(new Date(useArticleDate), $t("_common.date-format")) }}
        </div>

      </div>

      <!-- Start Preface -->
      <markdown :source="prefaceSource"
                :i18n="true"
                fallback-locale="en"
                :final-fallback-fn="()=>router.push({ path: `/404` })"
      />
      <!-- End Preface -->

      <!-- Start TimeStamp -->
      <div class="p-5" v-if="hasMediaTimeStamp">

        <div v-for="(item, i) in useMediaTimeStamp" :key="i" class="flex gap-4">
          <a class="block flex-none w-12 text-right text-sky-600 hover:text-sky-900 font-mono underline hover:underline underline-offset-2" @click.prevent="changeMediaTimeStamp(item.stamp)">{{ item.displayTime }}</a>
          <span class="block flex-1"> {{ item.content }} </span>
        </div>

      </div>
      <!-- End TimeStamp -->

      <!-- Start Content -->
      <markdown :source="contentSource"
                :i18n="true"
                fallback-locale="en"
                :final-fallback-fn="()=>router.push({ path: `/404` })"
      />
      <!-- End Content -->

      <div class="makers">
        <p class="font-bold"> {{ $t('2f.producers-of-this-episode') }} </p>
        <article-cards-authors :author="useAuthor"
                               :display-author-mode="'all-but-avatar'"
                               :display-author-by="false"
                               :display-conjunctions="false"
                               :use-extend-strategy="[{key:'speaker', mode:'i18n'},{key: 'host', mode:'i18n'}]"
        />
      </div>

    </div>

  </body-block>

</template>

<style scoped lang="css">
.makers {
  @apply p-5 text-lg;

  :deep(.group-key) {
    @apply text-lg;
  }
}
</style>