<template>
    <video ref="videoPlayer" controls></video>
</template>


<script setup lang="ts">
import { WatchableObject } from '@/structures/viewables/watchables/watchobject';
import { onMounted } from 'vue';

const props = defineProps({
    watchable: {
        required: true,
        type: WatchableObject
    }
})
const videoPlayer = ref<HTMLVideoElement>();

function getVideoType(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = function (e) {
            const reader = e.target;
            const arr = new Uint8Array(reader?.result as ArrayBuffer).subarray(0, 12);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }

            switch (true) {
                case header.startsWith("00000014667479707174"):
                    resolve("video/mp4");
                    break;
                case header.startsWith("1a45dfa301"):
                    resolve("video/webm");
                    break;
                case header.startsWith("474946383961"):
                case header.startsWith("474946383761"):
                    resolve("video/gif");
                    break;
                case header.startsWith("000001ba"):
                    resolve("video/mpeg");
                    break;
                case header.startsWith("4357530000001468"):
                    resolve("video/x-flv");
                    break;
                case header.startsWith("3026b2758e66cf11"):
                    resolve("video/quicktime");
                    break;
                default:
                    reject("");
                    break;
            }
        };

        reader.readAsArrayBuffer(file.slice(0, 12));
    });
}

onMounted(async () => {
    if (!videoPlayer.value) return;

    const type = await getVideoType(videoPlayer.value.files[0]);

    var source = document.createElement("source");

    // API'den alınan video kaynağı
    var videoSrc = props.watchable.Url;

    // source elementine src ve type özelliklerini ayarlayın
    source.src = videoSrc;
    source.type = type;

    // video elementine source elementini ekleyin
    videoPlayer.value.appendChild(source);
});
</script>
