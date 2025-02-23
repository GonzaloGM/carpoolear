<template>
    <div class="rate-item" :class="themeClass">
        <template v-if="tripCardTheme === 'light'">
            <div class="rate-item-comment">
                {{rate.comment}}
            </div>

            <div v-if="!notReply" class="rate-item-value">
                <span v-if="rate.rating == 1">
                    Positiva
                    <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                </span>
                <span v-if="rate.rating == 0">
                    Negativa
                    <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                </span>

                <span class="pull-right clickeable" v-if="!rate.reply_comment && user.id === profile.id && config.allow_rating_reply" @click="showReply = !showReply">
                    <i class="fa fa-reply" aria-hidden="true"></i>
                </span>
            </div>

            <div class="rate-item-profile">
                <div class="trip_driver_img circle-box" v-imgSrc:profile="rate.from.image"></div>
                <strong>{{rate.from.name}}</strong>
            </div>
        </template>
        <template v-else>
            <div class="image-width">
                <div class="trip_driver_img circle-box" v-imgSrc:profile="rate.from.image"></div>
            </div>
            <div class="text-width">
                <div class="rate-item-title">
                    <div>
                        <strong>{{rate.from.name}}</strong>
                        <template v-if="!notReply">
                            <span class="rate-item-value">
                                <i class="fa fa-thumbs-up" aria-hidden="true" v-if="rate.rating == 1"></i>
                                <i class="fa fa-thumbs-down" aria-hidden="true" v-if="rate.rating == 0"></i>
                            </span>
                            <span class="pull-right clickeable" v-if="!rate.reply_comment && user.id === profile.id && config.allow_rating_reply" @click="showReply = !showReply">
                                <i class="fa fa-reply" aria-hidden="true"></i>
                            </span>
                        </template>
                    </div>
                    <template v-if="!notReply">
                        <div class="rate-item-detail" v-if="rate.trip.points.length > 0">
                            Viajó a {{rate.trip.points[rate.trip.points.length - 1].json_address.ciudad}} como {{rateType}}
                                - {{rate.rate_at | moment("DD/MM/YYYY")}}
                        </div>
                        <div class="rate-item-detail" v-else>
                            Viajó a {{ rate.trip.to_town }} como {{rateType}}
                                - {{rate.rate_at | moment("DD/MM/YYYY")}}
                        </div>
                    </template>
                    <template v-else>
                        <div class="rate-item-detail">
                            {{rate.created_at | moment("DD/MM/YYYY")}}
                        </div>
                    </template>
                </div>
                <div class="rate-item-comment">
                    {{rate.comment}}
                </div>
            </div>
        </template>
        <div class="reply-box" v-if="showReply">
            <label for="reply" class="label label-reply">Responder a la calificación</label>
            <textarea maxlength="260" v-model="comment" id="reply"></textarea>
            <div class="reply-btns">
                <button class="btn btn-primary" @click="onReply"> Responder </button>
                <button class="btn btn-primary" @click="onCancelReply"> Cancelar </button>
            </div>
        </div>
        <div class="reply_comment_content" v-if="!notReply && rate.reply_comment">
            <div class="reply_comment">
                <strong>{{ profile.name }} respondió: </strong>
                {{ rate.reply_comment }}
            </div>
            <div class="reply_comment_date">
                {{ rate.reply_comment_created_at | moment("calendar") }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'

export default {
    name: 'rate-item',
    props: {
        user: {
            type: Object,
            required: true
        },
        rate: {
            type: Object,
            required: true
        },
        id: {
            type: [String, Number],
            required: false,
            default: null
        },
        notReply: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props) {
        const store = useStore()
        const showReply = ref(false)
        const comment = ref('')

        const config = computed(() => store.getters['auth/appConfig'])
        const profile = computed(() => store.getters['profile/user'])
        
        const rateType = computed(() => {
            return props.rate.user_to_type === 0 ? 'pasajero' : 'conductor'
        })

        const tripCardTheme = computed(() => {
            return config.value ? config.value.trip_card_design : ''
        })

        const themeClass = computed(() => {
            return config.value ? 'rate-item-' + config.value.trip_card_design : ' rate-item-default'
        })

        const onReply = async () => {
            const data = {
                trip_id: props.rate.trip.id,
                user_id: props.rate.from.id,
                comment: comment.value
            }
            
            await store.dispatch('rates/reply', data)
            showReply.value = false
            props.rate.reply_comment = comment.value
            props.rate.reply_comment_created_at = moment(new Date()).format()
            comment.value = ''
        }

        const onCancelReply = () => {
            comment.value = ''
            showReply.value = false
        }

        return {
            showReply,
            comment,
            config,
            profile,
            rateType,
            tripCardTheme,
            themeClass,
            onReply,
            onCancelReply
        }
    }
}
</script>

<style scoped>
    .rate-item-light .rate-item-comment {
        color: var(--primary-color);
        margin-bottom: .6rem;
    }
    .rate-item-light .rate-item-value {
        color: var(--secondary-color);
        font-size: 14px;
    }
    .rate-item-light .rate-item-value .fa {
        color: var(--secondary-color);
        font-size: 14px;
        margin-bottom: .6rem;
        margin-left: .25rem;
        padding-left: 0;
    }
    .rate-item-profile .trip_driver_img {
        max-width: 30px;
        height: 30px;
        border: 1px solid #DDD;
        vertical-align: middle;
        margin-right: .25rem;
    }
    .rate-item-profile strong {
        vertical-align: middle;
        font-size: 14px;
    }
    .reply_comment_content {
        margin-top: 1.25em;
        padding-left: 1em;
        font-size: 0.9em;
    }
    .reply_comment_content .reply_comment_date {
        font-size: 0.95em;
        font-style: italic;
        margin-top: .5em;
        color: #999;
    }
    .reply-btns {
        margin-top: 1em;
    }
    .label-reply {
        display: block;
        font-weight: bold;
        margin-top: 1.5em;

        padding: 0;
        font-size: 0.9rem;
        font-weight: bold;
        line-height: 1.5em;
        color: #333;
        text-align: left;
        border-radius: 0;
    }
    .reply-box {
        width: 100%;
        float: left;
    }
    textarea {
        height: 6.6em;
    }
    .reply_comment_content[data-v-79e4aac3] {
        word-wrap: break-word;
        float: left;
        width: 100%;
    }
</style>
