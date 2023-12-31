<script setup lang="ts">
import {computed, onMounted, onUnmounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUiStore} from "@/stores/uiStore";
import {useEmitter} from "@/hooks/useEmitter";
import {setTitle} from "@/hooks/usePageToolkits";
import {queryPagedEpisode} from "@/apis/QueryPagedEpisodeApi";
import type {EpisodeIndexModel, PageDescriptor} from "@/apis/ContentModels";

import BodyBlock from "@/components/blocks/BodyBlock.vue";
import ArticleCards from "@/components/articles/ArticleCards.vue";
import ArticleNav from "@/components/articles/ArticleNav.vue";

setTitle("home", 'i18n');

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const emitter = useEmitter();
const list = reactive<EpisodeIndexModel[]>([]);
const page = reactive<PageDescriptor>({current: 1, total: 1, name: "", nameSeries: []});

const updatePage = (models: EpisodeIndexModel[], pageModel: PageDescriptor) => {
  list.length = 0;
  for (const model of models) {
    list.push(model);
  }
  page.current = pageModel.current;
  page.total = pageModel.total;
  page.name = pageModel.name;
  page.nameSeries = [];
  if (pageModel.nameSeries)
    for (const name of pageModel.nameSeries) {
      page.nameSeries.push(name);
    }
};

const getCurrentPageNumber = () => {
  if (page.current >= page.total)
    return page.total;
  if (page.current <= 0)
    return 1;
  return page.current;
};

const getPreviousPageNumber = () => {
  if (page.current <= 1)
    return 1;
  if (page.current > page.total)
    return page.total;
  return page.current - 1;
};

const getNextPageNumber = () => {
  if (page.current >= page.total)
    return page.total;
  if (page.current <= 0)
    return 1;
  return page.current + 1;
};

const hasPreviousPage = computed(() => {
  return page.current > 1;
});
const hasNextPage = computed(() => {
  return page.current < page.total;
});
const moreThanOnePage = computed(() => {
  return page.total > 1;
});

const loadPageEpisodeAsync = async (queryPageNumber: number, locale?: string) => {
  await queryPagedEpisode(
      queryPageNumber,
      locale ?? uiStore.locale,
      (data => {
        updatePage(data.list, data._page);
      }),
      () => {
        router.push({path: "/404"});
      }
  );
};

const loadPreviousPageAsync = async () => {
  if (hasPreviousPage.value) {
    await loadPageEpisodeAsync(getPreviousPageNumber());
  }
};

const loadNextPageAsync = async () => {
  if (hasNextPage.value) {
    await loadPageEpisodeAsync(getNextPageNumber());
  }
};

onMounted(async () => {

  const pageNumStr = route.params.pageNo as string;
  const pageNumber = parseInt(pageNumStr ?? "1");

  emitter.on("toChangeLocale", async (e) => {
    const event = e as { locale: string };
    await loadPageEpisodeAsync(getCurrentPageNumber(), event.locale);
  });

  await loadPageEpisodeAsync(pageNumber);

});

onUnmounted(() => {
  emitter.off("toChangeLocale");
});

</script>

<template>

  <body-block class="my-3">


    <article-nav v-if="moreThanOnePage"
                 :descriptor="page"
                 :previous="async ()=>await loadPreviousPageAsync()"
                 :next="async ()=>await loadNextPageAsync()"
                 :first="async ()=>await loadPageEpisodeAsync(1)"
                 :last="async ()=>await loadPageEpisodeAsync(page.total)"
                 :go="async (pageNumber)=>await loadPageEpisodeAsync(pageNumber)"
                 :hidden-if-btn-disabled="true"
                 base-url="/show-notes"
    />

    <article-cards :articles="list"
                   default-display-mode="card"
                   :display-description="true"
                   base-url="/show-notes"
                   display-author-mode="all-but-avatar"
                   :display-author-by="false"
                   :display-conjunctions="false"
                   :use-author-extend-strategy="[{key:'speaker', mode:'i18n'},{key: 'host', mode:'i18n'}]"
                   :enable-block-mode="false"
                   :enable-pure-block-mode="false"
                   :enable-grid-mode="false"
                   :enable-card-mode="true"
                   :open-in-new-tab="false"
                   image-style="width: 6rem; margin: 1.5rem 0;"
                   :with-shadow="false"
    />

    <article-nav v-if="moreThanOnePage"
                 :descriptor="page"
                 :previous="async ()=>await loadPreviousPageAsync()"
                 :next="async ()=>await loadNextPageAsync()"
                 :first="async ()=>await loadPageEpisodeAsync(1)"
                 :last="async ()=>await loadPageEpisodeAsync(page.total)"
                 :go="async (pageNumber)=>await loadPageEpisodeAsync(pageNumber)"
                 :hidden-if-btn-disabled="true"
                 base-url="/show-notes"
    />

  </body-block>
</template>

<style scoped lang="css">

</style>