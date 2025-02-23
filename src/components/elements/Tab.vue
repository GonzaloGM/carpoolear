<template>
    <div class="tab-component">
        <div class="tab-header">
            <ul class="nav nav-tabs">
                <li v-for="tab in tabs" 
                    :key="tab.id"
                    :class="getTabClass(tab)"
                    @click="selectTab(tab)">
                    <a href="#" @click.prevent>
                        {{ tab.name }}
                        <span v-if="tab.count" class="badge">{{ tab.count }}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
</template>

<!--style lang="sass" src=""></style-->

<script>
import { ref, computed } from 'vue'

export default {
    name: 'tab',
    props: {
        tabs: {
            type: Array,
            required: true
        },
        activeTab: {
            type: Number,
            default: 1
        },
        onTabChange: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const currentTab = computed({
            get: () => props.activeTab,
            set: (value) => props.onTabChange(value)
        })

        const getTabClass = (tab) => {
            return {
                active: currentTab.value === tab.id,
                disabled: tab.disabled
            }
        }

        const selectTab = (tab) => {
            if (!tab.disabled) {
                currentTab.value = tab.id
            }
        }

        return {
            currentTab,
            getTabClass,
            selectTab
        }
    }
}
</script>

<style scoped>
.tab-component {
    width: 100%;
    margin-bottom: 1em;
}

.tab-header {
    display: flex;
    border-bottom: 1px solid #ddd;
}

.nav-tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
}

.nav-tabs > li {
    cursor: pointer;
    padding: 10px 20px;
    transition: all 0.3s ease;
}

.nav-tabs > li.active > a {
    color: #555;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
}

.nav-tabs > li:hover {
    background-color: #f5f5f5;
}

.nav-tabs > li.active {
    border-bottom: 2px solid var(--primary-color);
}

.badge {
    margin-left: 5px;
    background-color: #337ab7;
}
</style>
