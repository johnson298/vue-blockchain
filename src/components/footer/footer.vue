<template>
<div class="footer-page">
    <el-row>
        <el-col class="content-warp" :xs="24" :sm="24" :md="{span:16,offset:4}"
            :xl="{span:16,offset:4}">
            <CornerMarker></CornerMarker>
            <div class="right">
                <div class="link __cursor" @click="win">Medium</div>
                <Language></Language>
            </div>
        </el-col>
    </el-row>
</div>


</template>

<script>

import CornerMarker from '../Corner-marker/Corner-marker';
import Language from '../Language/Language';
import {LINK} from '@/assets/js/link';

export default {
    components: {CornerMarker, Language},
    name: 'FooterPage',
    data() {
        return {};
    },
    mounted() {
    },
    methods: {
        win() {
            window.open(LINK.medium)
        }
    }
};
</script>

<style lang="less" scoped>
    .footer-page {
        position: fixed;
        bottom: 0;
        height: 64px;
        z-index: 100;
        width: 100%;
        border-top: 1px solid rgba(#000000, .1);
        display: none;
        background: var(--col-body-background);
        .content-warp {
            height: 64px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .right {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: var(--col-font);

                .link {
                    font-weight: 700;
                    padding: 0 20px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                }

                .lang {
                    padding: 0 20px;
                    border-left: 1px solid rgba(0, 0, 0, 0.1);
                }


            }
        }
    }

    @media (min-width: 960PX) {
        .footer-page {
            height: 64PX;
            display: block;

            .content-warp {
                height: 64PX;

                .right {
                    font-size: 14PX;

                    .link {
                        padding: 0 20PX;
                        height: 64PX;
                    }

                    .lang {
                        padding: 0 20PX;
                    }
                }
            }
        }
    }

</style>
