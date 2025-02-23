<template>
    <div class="message-wrapper" :class="[ author.id == user.id ? 'message-wrapper-me' : '']">
        <div class="message media">
            <div class="media-left" v-if="grupalChat">
                <div class="conversation_image circle-box media-object" v-imgSrc:profile="user.image" v-if="author.id != user.id"></div>
            </div>
            <div class="media-body">
                <div class="message_author" v-if="author.id != user.id && grupalChat">
                    <strong>{{ author.name }}</strong>
                </div>
                <div class="message_text">
                    {{ message.text }}
                </div>
                <div class="message_meta">
                    <span class="message_time">{{ date }}</span>
                    <span class="message_seen" v-if="message.no_of_read - 1 > 0" title="Mensaje visto por el usuario">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import moment from 'moment'

export default {
    name: 'message-view',
    props: {
        message: {
            type: Object,
            required: true
        },
        users: {
            type: Array,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const author = computed(() => {
            let user = props.users.find(item => props.message.user_id === item.id)
            return user || {}
        })

        const date = computed(() => {
            const today = new Date()
            today.setHours(0)
            today.setMinutes(0)
            today.setSeconds(0)
            if (moment(props.message.created_at)._d < today) {
                return moment(props.message.created_at).format('DD/MM/YYYY HH:mm')
            }
            return moment(props.message.created_at).format('LT')
        })

        const grupalChat = computed(() => false)

        return {
            author,
            date,
            grupalChat
        }
    }
}
</script>
