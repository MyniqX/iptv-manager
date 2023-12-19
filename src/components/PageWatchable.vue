<template>
    <div class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40" />
    <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
        tabindex="0" @click.self="closeModal" @keyup.esc="closeModal">
        <div class="max-w-xl relative p-4 w-full h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="border-b border-gray-200 dark:border-gray-600 p-2 rounded-t flex justify-between items-center">
                    <div>
                        <p class="p-2 text-lg font-medium">
                            {{ watchable.Name }}
                        </p>
                    </div>
                    <div class="flex flex-row">
                        <ButtonVue v-if="watchable.listed != EList.WATCHED" :icon="hovered ? Icons.trash : Icons.heart"
                            :title="hovered ? 'Remove' : 'Favor'" class="w-28"
                            :class="watchable.listed == EList.WATCH ? 'bg-blue-500 hover:bg-red-500' : 'hover:bg-inherit'"
                            @click="setList(EList.WATCH)" @mouseover="hovered = watchable.listed != EList.NONE"
                            @mouseout="hovered = false" />
                        <ButtonVue v-if="watchable.listed != EList.WATCH" :icon="hovered ? Icons.trash : Icons.check"
                            :title="hovered ? 'Remove' : 'Watched'" class="w-28 hover:bg-red-500"
                            :class="watchable.listed == EList.WATCHED ? 'bg-blue-500 hover:bg-red-500' : 'hover:bg-inherit'"
                            @click="setList(EList.WATCHED)" @mouseover="hovered = watchable.listed != EList.NONE"
                            @mouseout="hovered = false" />

                        <ButtonVue @click="closeModal" class="ml-2" :icon="Icons.cross" />
                    </div>
                </div>
                <!-- Modal body -->
                <div class="p-6 w-full">
                    <div class="flex flex-col w-full h-full">
                        <div class="flex flex-row">
                            <div class="rounded-lg relative flex-grow">
                                <CoverView :src="watchable.Logo" :alt="watchable.Name" />
                                <div v-if="help"
                                    class="absolute font-medium p-4 bottom-0 left-0 right-0 top-0 bg-gradient-to-br from-slate-200 dark:from-slate-700 bg-opacity-50 backdrop-blur-none overflow-y-auto break-words">
                                    <div class="flex flex-row items-center justify-between h-10">
                                        <p>To Open this video;</p>
                                        <ButtonVue :icon="Icons.cross" @click="help = false" />
                                    </div>
                                    <div>
                                        <ol>
                                            <li>Click '<a class="cursor-pointer" @click.prevent="menus[1].action">Copy
                                                    Link</a>'.</li>
                                            <li>Open one of your video players such as:
                                                <ul>
                                                    <li><a href="https://potplayer.daum.net/">Pot Player</a>,</li>
                                                    <li><a href="https://www.videolan.org/vlc/">VLC Player</a> etc.</li>
                                                </ul>
                                            </li>
                                            <li>Right-click on the video player and select "Open URL".</li>
                                            <li>Paste the copied link and click "Open".</li>
                                        </ol>

                                        <div class="h-10 mt-5">
                                            <p>To watch offline:</p>
                                        </div>

                                        <ol>
                                            <li>Click '<a class="cursor-pointer"
                                                    @click.prevent="menus[4].action">Download</a>'.</li>
                                            <li>You can double-click the file to watch after the download is complete.</li>
                                        </ol>
                                    </div>
                                </div>
                                <div v-else-if="watchMode"
                                    class="absolute flex flex-col font-medium p-4 bottom-0 left-0 right-0 top-0 bg-gradient-to-br from-slate-200 dark:from-slate-700 bg-opacity-50 backdrop-blur-none overflow-y-auto break-words">

                                    <p class="text-sm text-center items-center justify-center p-3">
                                        Don't forget, many video types wont support from browsers.
                                        Even if it's supported, it won't fully work. You may not see embedded sound streams and subtitles.

                                        <p>Click <a class="cursor-pointer" @click.prevent="help = true">Help me Watch</a> to see how to watch it.</p>
                                    </p>
                                    <video ref="videoElm" class="w-full flex-grow"  @error="videoError" controls>
                                      <source :src="watchable.Url" />
                                    </video>
                                </div>
                            </div>

                            <div class="aspect-[1/4] overflow-hidden">
                                <div class="flow flow-col gap-1 h-full overflow-y-auto overflow-x-hidden ">
                                    <ButtonVue v-for="menu in menus.filter(m => m.visible())" :key="menu.title"
                                        @click="menu.action" class="w-full" :icon="menu.icon" :vert="true" size="md">
                                        {{ menu.title }}
                                    </ButtonVue>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
ol {
    padding-left: 25px;
    padding-right: 10px;
}

ol>li {
    list-style-type: decimal;
}

p>a,
ol>li>a,
ul>li>a {
    color: blue;
    text-shadow: 1px 0px 1px black;
}
</style>

<script setup lang="ts">
import { WatchableObject } from '@/structures/viewables/watchables/watchobject';
import SvgView, { Icons } from './views/SvgView.vue';
import CoverView from './views/CoverView.vue';
import ButtonVue from './views/ButtonView.vue';
import { ref, watch, inject, onMounted, onUnmounted } from 'vue';
import { Toast } from '@/utils/toast';
import { EList } from '@/utils/elist';
import { IptvManager } from '@/structures/iptvmanager';

const manager = IptvManager.getInstance();
const hovered = ref(false);
const props = defineProps({
    watchable: {
        required: true,
        type: WatchableObject
    }
});

const emits = defineEmits(['close']);
const toast = Toast.getInstance();
const videoElm = ref<null | HTMLVideoElement>(null);
const help = ref(false);
const watchMode = ref(false);
let attempt = 0;
let videoLoaded = false;

const videoTypes = [ 'video/mkv', 'video/webm','video/mp4',
   
    'application/x-mpegURL',
];

onMounted(() => {
    videoLoad();
})

const videoLoad = () => {
    const sourceElement = document.createElement('source');
    sourceElement.src = props.watchable.Url;
    sourceElement.type = videoTypes[attempt];

  //  toast.addToast("trying video src: " + sourceElement.src + ", type: " + sourceElement.type);

    if (videoElm.value) {
        videoElm.value.innerHTML = '';
        videoElm.value.appendChild(sourceElement);
        videoElm.value.load();
        videoElm.value.onerror = videoError;
        videoLoaded = true;
    }

}

const videoError = () => {
    toast.addToast("video failed");
    attempt++;
    if (attempt > videoTypes.length) {
        return;
    }
    videoLoad();
}

const setList = (list: EList) => {
    if (props.watchable.listed === list) {
        list = EList.NONE;
    }
    else
        list = list;
    const catalog = manager.getCurrentCatalog();
    if (catalog) {
        catalog.setWatchableList(props.watchable, list);
    }
    props.watchable.listed = list;
}

interface Menu {
    title: string;
    icon: string;
    action: () => void;
    visible: () => boolean;
}

const encodeUrl = (url: string): string => encodeURIComponent(url);

const menus: Menu[] = [
    {
        title: "Help me Watch",
        icon: Icons.interrogation,
        action: () => {
            help.value = !help.value;
        },
        visible: () => true
    },
    {
        title: 'Copy Link',
        icon: Icons.link_alt,
        action: () => {
            const input = document.createElement('textarea');
            input.value = props.watchable.Url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy', false, input.value);
            document.body.removeChild(input);
            toast.addToast(props.watchable.Url, 'Link Copied');
        },
        visible: () => true
    },
    {
        title: 'Search on IMDB',
        icon: Icons.search,
        action: () => {
            const searchQuery = encodeUrl(props.watchable.Name);
            const searchUrl = `https://www.imdb.com/find?q=${searchQuery}&s=all`;
            window.open(searchUrl, '_blank');
        },
        visible: () => props.watchable.PossibleLiveStream === false
    },
    {
        title: 'Search on Google',
        icon: Icons.search,
        action: () => {
            const searchQuery = encodeUrl(props.watchable.Name);
            const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
            window.open(searchUrl, '_blank');
        },
        visible: () => props.watchable.PossibleLiveStream === false
    },
    {
        title: 'Download',
        icon: Icons.download,
        action: () => {
            window.open(props.watchable.Url, '_blank');
        },
        visible: () => props.watchable.possibleLiveStream === false
    },
    {
        title: "Watch",
        icon: Icons.play,
        action: () => {
            watchMode.value = !watchMode.value;
        },
        visible: () => props.watchable.PossibleLiveStream === false
    }
];


const closeModal = () => {
    emits('close');
}

</script>

