<template>
    <div class="col-md-20 col-md-offset-2">
        <div class="nav nav-tabs">
            <li>
                <router-link :to="{name: 'admin-page'}">
                    Graficos
                </router-link>
            </li>
            <li>
                <router-link :to="{name: 'admin-users'}">
                    Usuarios
                </router-link>
            </li>
            <li>
                <router-link :to="{name: 'admin-trips'}">
                    Viajes
                </router-link>
            </li>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'admin-nav',
    setup() {
        const selected = ref('')

        return {
            selected
        }
    }
}
</script>

<style scoped>
.nav-pills {
    font-size: 1.5em;
}
</style>
