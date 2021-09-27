<template>
    <div class="bridge-note">
        <el-dialog class="dialog-madel" :visible="open" @close="close">
            <header class="dialog-title">
                NOTE
            </header>
            <main class="main">
                <p>{{ $t('Transit.Note.0') }}</p>
                <p>{{ $t('Transit.Note.1') }}</p>
                <p>{{ $t('Transit.Note.2') }}</p>
                <p>{{ $t('Transit.Note.3') }}</p>
                <p class="link" v-html="$t('Transit.Note.4', {})"></p>
                <p>{{ $t('Transit.Note.5') }}</p>
                <p v-html="$t('Transit.Note.6')"></p>

            </main>
            <footer class="dialog-footer">
                <div class="checkbox">
                    <el-checkbox v-model="checked">{{$t('Transit.Note.7')}}</el-checkbox>
                </div>
                <div>
                    <el-button
                        class="__button swap implement-btn"
                        @click="close"
                    >
                        {{ $t('Button.Ok') }}
                    </el-button>
                </div>
            </footer>
        </el-dialog>
    </div>
</template>

<script>
import {$storage} from '@/assets/storage';

export default {
    name: 'BridgeNote',
    data() {
        return {
            open: !$storage.get('BRIDGE_NOTE'),
            checked: false
        };
    },
    methods: {
        close() {
            if (this.checked) {
                $storage.set('BRIDGE_NOTE', true);
            }
            this.open = false;
        }
    }
};
</script>

<style lang="less" scoped>
.bridge-note {

    .main{
        height: 400px;
        overflow-y: auto;
    }
    .dialog-title {
        font-weight: 700;
        font-size: 20px;
        color: #1e2226;
    }

    p {
        line-height: 26px;
        font-size: 16px;
        color: #1e2226;
        .link {
            a {
                color: #3B8CFF;
                cursor: pointer;
            }

        }
    }

    main > p:not(:last-child) {
        margin-bottom: 20px;
    }

    .dialog-footer {
        display: flex;
        justify-content: space-between;
    }

    .checkbox {
        display: flex;
        align-items: center;
        color: #1e2226;
    }
}
</style>
