<template>
    <input ref="input" type="file" @change="onFileChange" v-show="false">
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'uploadfile',
    props: ['name'],
    setup(props, { emit }) {
        const input = ref(null)

        const show = () => {
            input.value.click()
        }

        const onFileChange = (e) => {
            let files = e.target.files || e.dataTransfer.files
            if (!files.length) return
            createImage(files[0])
        }

        const createImage = (file) => {
            let reader = new FileReader()
            reader.onload = (e) => {
                let image = e.target.result
                let data = {}
                data[props.name] = image
                emit('change', data)
            }
            reader.readAsDataURL(file)
        }

        return {
            input,
            show,
            onFileChange
        }
    }
}
</script>
