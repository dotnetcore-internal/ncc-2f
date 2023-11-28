<script setup lang="ts">
import {RouterView, useRoute} from "vue-router";

import {useUiStore} from "@/stores/uiStore";
import {getCookieValueWithDefaults} from "@/hooks/usePageToolkits";

import NavigationResources from "@/components/common/NavigationResources.vue";
import HorizontalRuleElement from "@/components/basic/HorizontalRuleElement.vue";
import PlaceholderBlock from "@/components/blocks/PlaceholderBlock.vue";
import HeaderTitle from "@/components/common/header/HeaderTitle.vue";
import FooterPendant from "@/components/common/footer/FooterPendant.vue";
import FooterLocale from "@/components/common/footer/FooterLocale.vue";
import LeftRightLayout from "@/components/basic/LeftRightLayout.vue";
import FooterCopyright from "@/components/common/footer/FooterCopyright.vue";
import FooterNccLogo from "@/components/common/footer/FooterNccLogo.vue";
import Anchor from "@/components/basic/AnchorElement.vue";

const route = useRoute();
const uiStore = useUiStore();

const locale = getCookieValueWithDefaults<string | unknown>("locale", (t) => t === undefined || t === null || t === "", () => "en") as string;

uiStore.setLocale(locale ?? "en");

const isCurrentPage = (name: string) => {
  return route.name === name;
}

</script>

<template>

  <header-title/>

  <div class="mt-32 lg:mt-24 min-h-75vh">

    <div class="responsive-width">

      <div class="lg:flex">

        <div class="lg:flex-none lg:w-80">

          <anchor href="/"
                  route-name="home"
                  class="block rounded-xl bg-slate-200 w-24 lg:w-48 h-24 lg:h-48 mt-8 mx-auto overflow-hidden">

          </anchor>

          <anchor href="/"
                  route-name="home"
                  class="block text-center text-2xl font-black my-4">
            二層樓
          </anchor>

          <div class="text-slate-600 text-center lg:text-left font-light lg:w-48 mx-auto">
            聊聊技术、程序员和 .NET……除了技术，我们还应有社交与生活。
          </div>

          <div class="text-center lg:text-left lg:w-48 mx-auto mt-8 text-sm">
            <div class="w-16 h-1 border-t border-slate-600 mx-auto lg:mx-0 my-4"/>
            <anchor href="/"
                    route-name="home"
                    :class="{
                      'font-bold': isCurrentPage('home')
                    }"
                    class="lg:block m-2 leading-7">
              首页
            </anchor>
            <anchor href="/about"
                    route-name="about"
                    :class="{
                      'font-bold': isCurrentPage('about')
                    }"
                    class="lg:block m-2 leading-7">
              关于
            </anchor>
            <anchor href="/speakers"
                    route-name="speakers"
                    :class="{
                      'font-bold': isCurrentPage('speakers')
                    }"
                    class="lg:block m-2 leading-7">
              嘉宾们
            </anchor>
            <anchor href="/how-to"
                    route-name="how-to"
                    :class="{
                      'font-bold': isCurrentPage('how-to')
                    }"
                    class="lg:block m-2 leading-7">
              参与二层楼？
            </anchor>
          </div>

        </div>

        <div class="lg:flex-1"
             :class="{'responsive-width': uiStore.isMobileMode}">
          <RouterView/>
        </div>

      </div>

    </div>


  </div>

  <footer class="bg-black text-white relative">
    <div class="responsive-width">

      <placeholder-block height="50px"/>

      <div class="text-6xl text-white font-black p-5">
        <span class="bg-gradient-to-b from-yellow-400 to-yellow-200 text-black rounded-xl px-3 py-1">Actions</span>
        speak louder than
        <span class="bg-gradient-to-b from-slate-400/30 to-slate-200/30 rounded-xl px-3 py-1">words</span>.
      </div>

      <placeholder-block height="30px"/>

      <horizontal-rule-element colorMode="dark"/>

      <placeholder-block height="30px"/>

      <navigation-resources/>

      <placeholder-block height="1.25rem"/>

      <div class="p-5">
        <div class="inline-block align-middle">
          <a href="https://ncc.work/" title=".NET Core Community">
            <img src="/images/logo.black.png" width="220" alt="NCC"/>
          </a>
        </div>
      </div>

      <div class="clear-both"></div>

      <div class="pb-2.5 px-5" v-show="!uiStore.isMobileMode">
        {{ $t("footer-we-part1") }} <span class="text-xl font-bold">{{ $t("footer-we-part2") }}</span>{{ $t("footer-we-part3") }} <br/>
        {{ $t("footer-we-part4") }}
      </div>

      <div class="clear-both"></div>

      <left-right-layout>

        <template #left>
          <div class="p-5 inline-block align-middle">
            <a href="https://ncc.work/all-ncc"
               class="text-white font-bold border p-2 px-5">
              {{ $t("all-ncc") }}
            </a>
          </div>
        </template>

        <template #right>
          <div class="p-5">
            <FooterPendant/>
          </div>
        </template>

      </left-right-layout>

      <horizontal-rule-element colorMode="dark"/>

      <footer-copyright>
        <template #maintain-by>
          <anchor href="https://ncc.work/" title=".NET Core Community" mode="classic" class="underline hover:underline underline-offset-4">NCC</anchor>
        </template>
      </footer-copyright>

      <footer-ncc-logo/>

      <footer-locale/>

      <div class="clear-both"></div>

      <placeholder-block height="90px" bg-color="bg-black"/>

    </div>
  </footer>

</template>

<style src="./App.css" lang="css"></style>
