import {ref} from "vue";
import {defineStore} from "pinia";

export const useUiStore = defineStore("ui", () => {

    //region isMobileMode
    const isMobileMode = ref(false);

    const setMobileMode = (mobileMode: boolean) => isMobileMode.value = mobileMode;

    //endregion

    //region Locale

    const locale = ref("en");

    const setLocale = (newLocale: string) => {
        locale.value = newLocale;
    };

    //endregion

    //region Media Status

    const currentMedia = ref<'bilibili' | 'youtube' | 'none'>("none");

    const setCurrentMedia = (media: 'bilibili' | 'youtube' | 'none') => currentMedia.value = media;

    //endregion

    return {
        isMobileMode,
        setMobileMode,
        locale,
        setLocale,
        currentMedia,
        setCurrentMedia,
    };
});