<template>
    <div class="flex flex-col w-full h-screen">
        <div class="flex flex-col w-full items-start justify-between p-2 mb-2 border rounded-lg dark:border-gray-600">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Add Profile</label>
            <div class="flex relative w-full">
                <div class="w-10 flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none overflow-hidden">
                    <SvgView :icon="Icons.link_alt" class="w-5 h-5" fillColor="white" />
                </div>
                <input v-model="mUrl" type="url" required="true" placeholder="enter your iptv link here"
                    class="p-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10 pr-20" />
                <div class="absolute right-2.5 bottom-2.5">
                    <button @click="add()"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</Button>
                </div>
            </div>
        </div>

        <div class="w-full">
            <h3 class="font-medium text-4xl text-center py-10 text-black dark:text-white" v-if="profiles.size === 0">Enter
                your iptv url up and create your first profile.</h3>
            <div v-else>
                <div :class="deleteProf >= 0 ? 'bg-red-400 dark:bg-red-400' : ''"
                    class="w-full  text-gray-900 bg-transparent border border-gray-200 rounded-lg dark:bg-transparent dark:border-gray-600 dark:text-white p-3">
                    <div v-if="deleteProf >= 0"
                        class="flex flex-col transition-all  align-middle items-center gap-2 font-medium text-xl">
                        <p class="text-black">'profile#{{ deleteProf }}' ll be deleted?</p>
                        <div class="flex gap-4">
                            <button
                                class="text-white flex gap-2 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                @click="remove()">Okey</button>
                            <button
                                class="text-white flex gap-2 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                @click="deleteProf = -1">Cancel</button>
                        </div>
                    </div>
                    <div v-else class="font-mono text-sm">
                        <span>Status :</span>
                        <span>{{ Status }}</span>
                    </div>
                </div>
                <div class="w-full flex flex-col lg:flex-row mt-2">

                    <div
                        class="w-full lg:w-1/4 text-sm font-medium overflow-auto flex flex-wrap lg:flex-col text-gray-900 bg-transparent border border-gray-200 rounded-lg dark:bg-transparent dark:border-gray-600 dark:text-white">
                        <button v-for="    [id, p]     in     profiles    " :key="id" @click="selProf(p)"
                            :class="sProf === p ? 'text-blue-700 font-bold' : ''"
                            class="m-1 px-4 py-2 border text-center border-gray-200 rounded-lg dark:border-gray-600">
                            {{ p.name }}
                        </button>
                    </div>

                    <div v-if="sProf"
                        class="w-full flex flex-col lg:flex-row overflow-hidden text-gray-900 bg-transparent border border-gray-200 rounded-lg dark:bg-transparent dark:border-gray-600 dark:text-white">
                        <table class="w-full text-sm text-left border-r border-r-gray-600 text-gray-500 dark:text-gray-400">
                            <tbody>
                                <tr v-for="    el     in     sTalbe    " :key="el[1]"
                                    class="bg-white dark:bg-gray-800 border-b border-b-gray-600 dark:border-gray-700">
                                    <th scope="row"
                                        class="px-6 py-1 w-1/3 font-medium text-gray-900 whitespace-nowrap items-baseline dark:text-white">
                                        <SvgView :icon="el[0]" class="w-4 h-4 inline-flex mx-1" />
                                        <span class="align-middle h-4"> {{ el[1] }} </span>
                                    </th>
                                    <td class="px-6 py-1 w-2/3 text-center font-medium text-blue-950 dark:text-blue-100">
                                        <span class="align-middle h-4 text-ellipsis"> {{ el[2] }} </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="flex gap-2 flex-row-reverse lg:flex-col w-full lg:w-2/5 p-2">
                            <button @click="load(<Profile>sProf)"
                                class="text-white flex gap-2 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <SvgView :icon="Icons.play" class="w-5 h-5" />
                                Load
                            </button>

                            <button @click="update(<Profile>sProf)"
                                class="text-white flex gap-2 items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <SvgView :icon="Icons.refresh" class="w-5 h-5" />
                                <div class="flex flex-col text-left leading-4">
                                    Update <span class="text-[10px] text-black text-left">{{ sProf.lastUpdated }}</span>
                                </div>
                            </button>


                            <button @click="deleteProf = sProf.id"
                                class="text-white flex gap-2 items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center dark:focus:ring-blue-800">
                                <SvgView :icon="Icons.trash" class="w-5 h-5" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-wrap p-6  gap-2 mt-2 border border-gray-200 rounded-lg dark:border-gray-600">
            <ToggleView v-model="loadOn" class="flex-grow">On start, automaticly load last profile</ToggleView>
            <ToggleView v-model="switchTheme" class="flex-grow">Dark Theme</ToggleView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IptvManager } from '@/structures/iptvmanager';
import { Profile } from '@/structures/profiles/profile';
import { ref, onMounted, computed } from 'vue';
import SvgView, { Icons } from '@/components/views/SvgView.vue';
import ToggleView from './views/ToggleView.vue';
import { Catalog } from '@/structures/viewables/groups/catalog';

const loadOn = ref(true);
const iptv = IptvManager.getInstance();

const switchTheme = computed({
    get() {
        return document.documentElement.classList.contains('dark');
    },
    set(val) {
        iptv.setTheme(val);
    }
});

const emits = defineEmits(["onLoad"]);

const profiles = ref(iptv.profileMap);
const mUrl = ref('');
const sProf = ref<Profile | undefined>(undefined);
const sTalbe = ref<any>(undefined);
const deleteProf = ref(-1);
const Status = ref('ready...');

/**
 * A function that adds a profile.
 *
 * @param {string} mUrl - The URL of the profile to be added.
 * @return {undefined} This function does not return a value.
 */
function add() {
    iptv.addProfile(mUrl.value);
    mUrl.value = "";
    deleteProf.value = -1;
}

/**
 * Updates the selected profile in the UI by setting the values of the
 * sTalbe, sProf, and deleteProf variables. It also calls the fillTable
 * function to populate the sTalbe variable with data from the given
 * profile.
 *
 * @param {Profile} p - The profile object to be set as the selected profile.
 */
function selProf(p: Profile) {
    sTalbe.value = fillTable(p);
    sProf.value = p;
    deleteProf.value = -1;
}

/**
 * Generates a table of profile information.
 *
 * @param {Profile} prof - The profile object containing the information to be displayed in the table.
 * @return {Array<Array<any>>} - An array of arrays representing the table rows, where each inner array contains the icon, label, and corresponding value for each profile attribute.
 */
function fillTable(prof: Profile) {
    const created = new Date(prof.createdDate);
    const formattedDate = `${(created.getDate() + 1).toString().padStart(2, '0')}-${(created.getMonth() + 1).toString().padStart(2, '0')}-${created.getFullYear()} ${created.getHours()}:${created.getMinutes()}`;
    return [
        [Icons.link_alt, "Url", prof.url],
        [Icons.info, "Created Date", formattedDate],
        [Icons.upload, "Last Update", prof.lastUpdated],
        [Icons.folder, "Group", prof.groupCount],
        [Icons.film, "Movies", prof.movieCount],
        [Icons.livestream, "Live Streams", prof.liveStreamCount],
        [Icons.tvshow, "TvShows", prof.tvShowCount],
        [Icons.folder_tree, " > Seasons", prof.tvShowSeasonCount],
        [Icons.folder_tree, " > Episodes", prof.tvShowEpisodeCount],
        [Icons.info, "Total", prof.totalCount]
    ];
}

/**
 * Selects the first profile from the profile map.
 *
 * @return {void} - No return value.
 */
const selectFirst = () => {
    for (const p of iptv.profileMap.values()) {
        selProf(p);
        return;
    }
    deleteProf.value = -1;
}

onMounted(() => {
    selectFirst();
});

const onLoad = (c: Catalog) => emits("onLoad", c);

const load = async (p: Profile) => await doCatalog(p, false);
const update = async (p: Profile) => await doCatalog(p, true);

/**
 * Performs catalog operation.
 *
 * @param {Profile} p - The profile to use for the catalog operation.
 * @param {boolean} update - Whether to update the catalog.
 * @return {Promise<void>} A promise that resolves when the catalog operation is completed.
 */
const doCatalog = async (p: Profile, update: boolean) => {
    emits("onLoad", null);
    const c = await iptv.loadCatalog(p, update, (msg: string) => Status.value = msg);
    onLoad(c);
}

/**
 * Removes a profile.
 *
 * @param {type} deleteProf - the profile to be deleted
 * @return {undefined} no return value
 */
const remove = () => {
    iptv.remProfile(deleteProf.value);
    selectFirst();
}

</script>
