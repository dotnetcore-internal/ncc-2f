<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useElementSize} from "@vueuse/core";
import {useEmitter} from "@/hooks/useEmitter";
import {useUiStore} from "@/stores/uiStore";
import {av2cid, bv2av} from "@/utils/bilibiliUtils";

const uiStore = useUiStore();
const emitter = useEmitter();

const props = withDefaults(defineProps<{
  bvid: string;
  page?: number;
  autoplay?: boolean;
  isWide?: boolean;
  highQuality?: boolean;
  hasDanmaku?: boolean;
  aspectWidth?: number;
  aspectHeight?: number;
  width?: string | number;
  height?: string | number;
  iframeClass?: string;
  timestamp?: number;
}>(), {
  page: 1,
  isWide: true,
  autoplay: false,
  highQuality: true,
  hasDanmaku: false,
  width: 480,
  iframeClass: '',
  timestamp: 0,
});

const mediaRef = ref(null);
const {width, height} = useElementSize(mediaRef);

watch(width, (v) => {
  height.value = calcHeight(v);
  currentHeight.value = height.value;
});

// 时间戳如果是 number，表示秒，后面加 s；如果是 string，原样返回
// 如果是 0 或者 '0s'，将返回空
// 注意，返回的结果将不包含 t=
const timestamp = ref<number>(0);
const currentAspectWidth = ref(0);
const currentAspectHeight = ref(0);
const currentHeight = ref<number | string | undefined>();
const currentAutoPlay = ref(false);

const aid = ref(0);
const cid = ref(0);

const useTimeStamp = computed(() => {
  return timestamp.value;
});

const useCid = computed(() => {
  return cid.value;
});

const calcHeight = (width: number) => {
  return (width * currentAspectHeight.value) / currentAspectWidth.value;
};

const useHeight = computed(() => {
  if (props.height) {
    return props.height
  } else if (typeof props.width === 'number') {
    return calcHeight(props.width);
  } else if (props.width.trim().endsWith('px')) {
    const widthNum = Number(props.width.replace('px', ''))
    return calcHeight(widthNum);
  } else if (props.width.trim().endsWith('%')) {
    let percent = Number(props.width.replace('%', ''));
    percent = percent >= 0 && percent <= 100 ? percent : 100;
    return `${percent}%`;
  }
  return 360;
});

const useHighQuality = computed(() => {
  return props.highQuality ? 1 : 0;
});

const useWide = computed(() => {
  return props.isWide ? 1 : 0;
});

const useAutoPlay = computed(() => {
  return currentAutoPlay.value ? 1 : 0;
});

const useDanmaku = computed(() => {
  return props.hasDanmaku ? 1 : 0;
});

const useIframeSrc = computed(() => {
  const base = '//player.bilibili.com/player.html'
  return `${base}?aid=${aid.value}&bvid=${props.bvid}&page=${props.page}&cid=${useCid.value}&high_quality=${useHighQuality.value}&as_wide=${useWide.value}&danmaku=${useDanmaku.value}&autoplay=${useAutoPlay.value}`
});

const useIframeSrcWithTs = computed(() => {
  return `${useIframeSrc.value}&t=${useTimeStamp.value}`
});

const useSrcWithTs = ref(true);
const usePausedStatus = ref(false);

const useIframeUrl = computed(() => {
  return usePausedStatus.value
      ? ''
      : useSrcWithTs.value
          ? useIframeSrcWithTs.value
          : useIframeSrc.value;
});

onMounted(async () => {

  aid.value = bv2av(props.bvid);
  cid.value = av2cid(aid.value);

  timestamp.value = props.timestamp;
  currentAspectHeight.value = props.aspectHeight ?? uiStore.isMobileMode ? 9 : 3;
  currentAspectWidth.value = props.aspectWidth ?? uiStore.isMobileMode ? 16 : 4;
  currentHeight.value = props.height;
  currentAutoPlay.value = props.autoplay;

  emitter.on('updateTimeStamp', (e) => {
    const event = e as { timestamp: number, to: 'bilibili' | 'youtube' };
    if (event.to === 'bilibili') {
      timestamp.value = event.timestamp;
      currentAutoPlay.value = true;
      // 使用有时间戳版本
      useSrcWithTs.value = true;
    }
  });

  emitter.on('pauseBiliPlay', (e) => {
    const event = e as { status: boolean };
    if (event.status) {
      //切换，手工暂停
      usePausedStatus.value = true;
    } else {
      // 切换，开始播放
      usePausedStatus.value = false;
      // 使用无时间戳版本
      useSrcWithTs.value = false;
    }
  });
});

onUnmounted(() => {
  emitter.off('updateTimeStamp');
  emitter.off('pauseBiliPlay')
});

</script>

<template>
  <div class="w-full" ref="mediaRef">
    <iframe
        id="bilibili-iframe"
        loading="lazy"
        :width="width"
        :height="useHeight"
        :src="useIframeUrl"
        data-rocket-lazyload="fitvidscompatible"
        :data-lazy-src="useIframeUrl"
        :allowFullScreen="true"
        :class="{ iframeClass }"
        scrolling="no"
        border="0"
        frameborder="0"
        framespacing="0"
        data-ll-status="loaded"
        sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
    />
  </div>
</template>

<style scoped lang="css">

</style>