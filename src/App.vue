<template>
  <div class="bg-gray-100  dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200">
    <header class="antialiased fixed w-screen z-40 bg-inherit">
      <nav class=" px-4 lg:px-6 z-50 py-0.5 h-16 border">
        <div class="flex flex-wrap justify-between items-center">

          <div class="flex h-14 justify-start items-center flex-grow  transition-all">
            <ButtonVue @click="toggleDrawer = !toggleDrawer" :icon="Icons.menu_burger" class="sm:hidden"/>
            <a href="#" v-if="!toggleSearch" class="flex mr-4 items-center">
              <SvgView :icon="Icons.play" class="mr-2 h-7 w-7" />
              <span class="self-center text-xl font-semibold whitespace-nowrap">IpTv Manager</span>
            </a>

            <form action="#" method="GET" :class="toggleSearch ? 'block' : 'hidden md:block'" class="lg:pl-2 w-full">
              <label for="topbar-search" class="sr-only">Search</label>
              <div class="relative mt-1 md:w-full">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <SvgView :icon="Icons.search" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input id="topbar-search" type="text" @input="searchInputChanged"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-9 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Search">
              </div>
            </form>
          </div>

          <div class="flex items-center lg:order-2">
            <ButtonVue @click="toggleSearch = !toggleSearch" :icon="toggleSearch ? Icons.cross : Icons.search" 
            class="md:hidden"/>
            <ButtonVue @click="showProfile = !showProfile" :icon="Icons.users" />
            <ButtonVue @click="manager.toggleTheme()" :icon="Icons.unlock" />
          </div>
        </div>
      </nav>
    </header>

    <aside v-if="selectedCatalog" class="fixed top-16 left-0 bottom-0 z-40 w-1/2 sm:w-44 md:w-60 border-1 transition-transform"
      :class="toggleDrawer ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'">
      <SidePanel :tree="selectedCatalog" :loading="sidePanelLoading" @selectedGroup="onSelectGroup" />
    </aside>

    <main class="p-4 pt-20 flex flex-col h-screen"
    :class="selectedCatalog ? 'sm:pl-48 md:pl-64':''"
    >
      <div v-if="!showProfile && selectedCatalog" class="flex flex-row mb-1 items-center gap-2">
        <ButtonVue :disabled="selectedCatalog === selectedGroup" @click="onSelectGroup(selectedGroup?.UpperLevel)"
          :icon="Icons.angle_left" size="md" class="border-gray-400"/>

        <ButtonVue :disabled="selectedCatalog === selectedGroup" @click="onSelectGroup(selectedCatalog)"
        :icon="Icons.play" title="IpTv" />
        <div class="flex flex-row-reverse gap-2">
          <ButtonVue v-for="[name, group] of breadCrumbs" :key="name" @click="onSelectGroup(group)"
            :icon="Icons.angle_right" :title="name" />
        </div>
      </div>

      <div id="2" class="flex-grow overflow-y-auto h-full">
        <PageProfiles v-if="showProfile" :iptv="manager" @on-load="onLoadProfile" />
        <PageList v-else-if="selectedGroup" :group-object="selectedGroup" @on-group-selected="onSelectGroup"
          @on-wactable-selected="onSelectWatchable" />
        <div v-else class="flex justify-center items-center h-full">
            <svg  role="status" class="w-20 aspect-square fill-blue-100 animate-spin" viewBox="0 0 100 101"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                  <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
              </svg>
        </div>
      </div>

      <PageWatchable @close="selectedWatchable = null" v-if="selectedWatchable" :watchable="selectedWatchable" />
      <ToastVue></ToastVue>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import SidePanel from './components/SidePanel.vue';
import { IptvManager } from './structures/iptvmanager';
import CoverView from './components/views/CoverView.vue';
import { Catalog } from './structures/viewables/groups/catalog';
import { GroupObject } from './structures/viewables/groups/groupobject';
import SvgView, { Icons } from './components/views/SvgView.vue';
import { WatchableObject } from './structures/viewables/watchables/watchobject';
import PageProfiles from './components/PageProfiles.vue';
import PageList from './components/PageList.vue';
import PageWatchable from './components/PageWatchable.vue';
import ButtonVue from './components/views/ButtonView.vue';
import ToastVue from './components/Toast.vue';
import { Toast } from './utils/toast';

const selectedGroup = ref<GroupObject>();
const selectedWatchable = ref<WatchableObject | null>(null);
const sidePanelLoading = ref(false);
const toggleDrawer = ref(false);
const toggleSearch = ref(false);
const showProfile = ref(false);
const breadCrumbs = ref(new Map<string, GroupObject>());
const manager = IptvManager.getInstance();
const selectedCatalog = ref<Catalog | null>(null);
const searchResultGroup = ref<GroupObject>(new GroupObject());
const closeModal = () => selectedWatchable.value = null;
const toast = Toast.getInstance();


let timerID: number = -1;
const searchInputChanged = (event: Event) => {
  const str = (event.target as HTMLInputElement).value;
  if (str.length < 3 || selectedCatalog.value === null) {
    if (timerID >= 0) clearTimeout(timerID);
    timerID = -1;
    return;
  }
  searchResultGroup.value.clear();
  selectedGroup.value = searchResultGroup.value;
  if (timerID >= 0) clearTimeout(timerID);
  timerID = setTimeout(async () => {
    console.log("going for search : " + str);
    const result = await selectedCatalog.value?.startSearch(str, searchResultGroup);
    timerID = -1;
  }, 500);
}

function onSelectGroup(group: GroupObject) {
  selectedGroup.value = group;
  breadCrumbs.value = new Map();
  const top = selectedCatalog.value;
  for (let g = group; g.UpperLevel !== undefined; g = g.UpperLevel) {
    breadCrumbs.value.set(g.Name, g);
    if (g.UpperLevel === top) break;
  }
  showProfile.value = false;
}

function onSelectWatchable(watchable: WatchableObject) {
  selectedWatchable.value = watchable;
}

const onLoadProfile = (catalog: Catalog | null) => {
  if (catalog === null) {
    sidePanelLoading.value = true;
    selectedCatalog.value = null;
    return;
  }
  selectedCatalog.value = catalog;
  toast.addToast(`Profile ${catalog.profile.name} loaded.`)
  onSelectGroup(catalog);
}

onMounted(async () => {
  if (selectedCatalog.value === null) {
    const prof = manager.lastLoadedProfile();
    if (prof != null) {
      onLoadProfile(null);
      const c = await manager.loadCatalog(prof, false);
      onLoadProfile(c);
      onSelectGroup(c.movieList);
    }
    else {
      showProfile.value = true;
    }
  }

  const darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = darkThemeQuery.matches;
  manager.setTheme(manager.config.darkTheme ?? isDark);
});


</script>

<style>
/* Scroll çubuğunun genişliği */
::-webkit-scrollbar {
  width: 15px;
  height: 15px;
}

/* Scroll çubuğu arka planı */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px grey;
  border-radius: 6px;
  border: solid 2.5px transparent;
}

/* Scroll çubuğu */
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  box-shadow: inset 0 0 10px #888;
  border: solid 2.5px transparent;
}

/* Scroll çubuğu üzerine gelindiğinde */
::-webkit-scrollbar-thumb:hover {
  box-shadow: inset 0 0 10px #555;
}
</style>
