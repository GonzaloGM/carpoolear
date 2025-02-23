<template>
    <div class="tabset clearfix" :class="orientationClass()">
        <!-- Nav tabs -->
        <ul v-if="orientation != 'bottom' && orientation != 'right'" class="nav nav-tabs" :class="activeTabClass" role="tablist">
            <li class="nav-item" v-for="(tab, $index) in tabs">
                <a class="nav-link" :class="{ active: tab.active, disabled: tab.disabled }" :href="'#' + $index" role="tab" data-toggle="tab" @click.stop.prevent="activateTab($index)">{{ tab.header }}</a>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <slot></slot>
        </div>

        <!-- Nav tabs -->
        <ul v-if="orientation == 'bottom' || orientation == 'right'" class="nav nav-tabs" role="tablist">
            <li class="nav-item" v-for="(tab, $index) in tabs">
                <a class="nav-link" :class="{ active: tab.active, disabled: tab.disabled }" :href="'#' + $index" role="tab" data-toggle="tab" @click.stop.prevent="activateTab($index)">{{ tab.header }}</a>
            </li>
        </ul>
    </div>
</template>
<!--
<style lang="sass" src="./tabs.scss"></style>
-->

<script>
import { ref, computed } from 'vue'

export default {
    name: 'tabset',
    props: {
        orientation: {
            type: String,
            default: 'top'
        },
        keytabset: {
            type: String,
            default: 'tabset'
        },
        rememberTab: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const tabs = ref([])
        const activeTabIndex = ref(0)

        const activeTabClass = computed(() => 'active-' + activeTabIndex.value)

        const orientationClass = () => {
            return 'tabs-' + props.orientation
        }

        const activateTab = (index, ensure) => {
            activeTabIndex.value = index
            if (props.rememberTab) {
                if (window.sessionStorage && !ensure) {
                    window.sessionStorage.setItem(props.keytabset + '_last_active_tab', activeTabIndex.value)
                }
            }
            const tab = tabs.value[index]
            if (tab && !tab.disabled) {
                if (index === 'first') {
                    index = 0
                } else if (index === 'last') {
                    index = tabs.value.length - 1
                }
                tabs.value.forEach((tab, idx) => {
                    tab.active = idx === index
                })
            }
        }

        const getRememberedTab = (defaultValue) => {
            if (props.rememberTab) {
                if (window.sessionStorage) {
                    let savedIndex = window.sessionStorage.getItem(props.keytabset + '_last_active_tab')
                    if (savedIndex) {
                        return parseInt(savedIndex, 10)
                    }
                }
            }
            return defaultValue
        }

        const ensureActiveTab = () => {
            let activeTab = 0
            tabs.value.forEach((tab, index) => {
                if (tab.active) {
                    activeTab = index
                }
            })
            activateTab(activeTab, true)
        }

        const registerTab = (tab) => {
            tab.id = tabs.value.length
            tabs.value.push(tab)
            ensureActiveTab()
        }

        const removeTab = (tab) => {
            let index = tabs.value.findIndex(item => item.id === tab.id)
            if (index >= 0) {
                tabs.value.splice(index, 1)
            }
            ensureActiveTab()
        }

        return {
            tabs,
            activeTabIndex,
            activeTabClass,
            orientationClass,
            activateTab,
            getRememberedTab,
            ensureActiveTab,
            registerTab,
            removeTab
        }
    }
}
</script>
