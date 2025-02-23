<template>
    <div v-if="shouldShow">
        <slot name="title" v-if="$slots.title"></slot>
        
        <template v-if="isLoading">
            <slot name="loading">Loading...</slot>
        </template>
        
        <template v-else-if="isEmpty">
            <slot name="no-data">No data available</slot>
        </template>
        
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'loading',
    props: {
        data: {
            type: [Array, Object],
            required: true
        },
        hideOnEmpty: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { slots }) {
        const isEmpty = computed(() => {
            if (Array.isArray(props.data)) {
                return props.data.length === 0
            }
            return !props.data || Object.keys(props.data).length === 0
        })

        const isLoading = computed(() => props.data === null)

        const shouldShow = computed(() => {
            if (props.hideOnEmpty && isEmpty.value) {
                return false
            }
            return true
        })

        return {
            isEmpty,
            isLoading,
            shouldShow
        }
    }
}
</script>

<style scoped>
.loading-component {
    position: relative;
    min-height: 50px;
}
</style>
