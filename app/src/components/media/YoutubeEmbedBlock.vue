<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {useElementSize} from "@vueuse/core";
import {useEmitter} from "@/hooks/useEmitter";
import {useUiStore} from "@/stores/uiStore";

const uiStore = useUiStore();
const emitter = useEmitter();

const props = withDefaults(defineProps<{
  yid: string;
  aspectWidth?: number;
  aspectHeight?: number;
  width?: string | number;
  height?: string | number;
  iframeClass?: string;
  timestamp?: number;
}>(), {
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

const useTimeStamp = computed(() => {
  return `?start=${timestamp.value}`;
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

const useIframeSrc = computed(() => {
  return `https://www.youtube.com/embed/${props.yid}`
});

const useIframeSrcWithTs = computed(() => {
  return `${useIframeSrc.value}${useTimeStamp.value}`
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
  timestamp.value = props.timestamp;
  currentAspectHeight.value = props.aspectHeight ?? uiStore.isMobileMode ? 9 : 3;
  currentAspectWidth.value = props.aspectWidth ?? uiStore.isMobileMode ? 16 : 4;
  currentHeight.value = props.height;

  emitter.on('updateTimeStamp', (e) => {
    const event = e as { timestamp: number, to: 'bilibili' | 'youtube' };
    if (event.to === 'youtube') {
      timestamp.value = event.timestamp;
      // 使用有时间戳版本
      useSrcWithTs.value = true;
    }
  });

  emitter.on('pauseYoutubePlay', (e) => {
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
  emitter.off('pauseYoutubePlay')
});

</script>

<template>
  <div class="w-full" ref="mediaRef">
    <iframe
        id="youtube-iframe"
        loading="lazy"
        :width="width"
        :height="useHeight"
        :src="useIframeUrl"
        :data-lazy-src="useIframeUrl"
        :allowFullScreen="true"
        :class="{ iframeClass }"
        scrolling="no"
        border="0"
        frameborder="0"
        framespacing="0"
        data-ll-status="loaded"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  </div>
</template>

<style scoped lang="css">

</style>