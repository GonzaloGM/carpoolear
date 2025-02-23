<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'user-profile',
    props: {
        id: {
            type: [String, Number],
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const activeTab = ref(parseInt(route.params.activeTab) || 1)
        const loading = ref(false)
        const userProfile = ref(null)

        const currentUser = computed(() => store.getters['auth/user'])
        const config = computed(() => store.getters['auth/appConfig'])
        const isOwnProfile = computed(() => currentUser.value?.id === parseInt(props.id))

        onMounted(async () => {
            loading.value = true
            try {
                userProfile.value = await store.dispatch('users/find', props.id)
            } catch (error) {
                console.error('Error loading user profile:', error)
            } finally {
                loading.value = false
            }
        })

        const changeTab = (tabIndex) => {
            activeTab.value = tabIndex
            router.replace({ 
                name: 'profile', 
                params: { 
                    ...route.params,
                    activeTab: tabIndex 
                }
            })
        }

        return {
            activeTab,
            loading,
            userProfile,
            currentUser,
            config,
            isOwnProfile,
            changeTab
        }
    }
}
</script> 