<template>
<div :class="['wrapper', { active: active }]">
    <el-popover
        popper-class="__popover"
        width="330"
        trigger="click"
        @show="toggle"
        @hide="toggle"
        :visible-arrow="false"
        placement="bottom-end"
    >
        <a-icon slot="reference" class="icon-config" type="icon-setting"/>
        <div class="root">
            <div class="title">
                {{ $t('setting.settingTitle') }}
            </div>
            <div class="info">
          <span class="tip">
            {{ $t('setting.toleranceTitle') }}
          </span>
                <a-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('setting.proTxts.0')"
                >
                    <a-icon class="icon" type="icon-wenhao"/>
                </a-tooltip>
            </div>
            <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent>
                <el-form-item prop="rate">
                    <el-row :gutter="5">
                        <el-col v-for="d in radioGroup" :key="d.value" :span="6">
                            <div
                                :class="[
                    'radio',
                    {
                      active: d.value === tolerance,
                    },
                  ]"
                                @click="radioChange(d.value)"
                            >
                                {{ d.label }}
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <el-input
                                type="number"
                                size="small"
                                class="radio"
                                style="width: 100%"
                                v-model.number="form.rate"
                                @change="change"
                            >
                                <i slot="suffix">% </i>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <div class="info" style="padding-top:20px">
                        <span class="tip">
                          {{ $t('setting.deadlineTitle') }}
                        </span>
                    <a-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('setting.proTxts.1')"
                    >
                        <a-icon class="icon" type="icon-wenhao"/>
                    </a-tooltip>
                </div>
                <el-form-item>
                    <el-input
                        type="number"
                        v-model.number="minute"
                        style="line-height: 40px"
                    >
              <span slot="suffix">
                {{ $t('setting.minute') }}
              </span>
                    </el-input>
                </el-form-item>
                <!--                    <div class="title">-->
                <!--                        {{ $t('setting.LanguageSet') }}-->
                <!--                    </div>-->
                <!--                    <div class="languages">-->
                <!--                        <img-->
                <!--                                v-for="d in languages"-->
                <!--                                :class="{ active: d.key === $i18n.locale }"-->
                <!--                                :key="d.key"-->
                <!--                                :src="d.svg"-->
                <!--                                alt=""-->
                <!--                                @click="setLang(d.key)"-->
                <!--                        />-->
                <!--                    </div>-->
            </el-form>
        </div>
    </el-popover>
</div>
</template>

<script>
import {mapState} from 'vuex';
import {Languages} from '@/i18n/langs';

export default {
    name: 'GlobalConfig',
    data() {
        const validatePass = (rule, val, callback) => {
            if (+val === this.radioGroup[0].value) {
                return callback(this.$t('setting.msg.0'));
            } else if (+val < 50) {
                return callback(this.$t('setting.msg.1'));
            } else if (+val >= 50) {
                return callback(this.$t('setting.msg.2'));
            }
            callback();
        };
        return {
            active: false,
            form: {
                rate: 0.5,
            },
            rules: {
                rate: [
                    {required: true, trigger: 'change'},
                    {validator: validatePass, trigger: 'change'},
                ],
            },
            radioGroup: [
                {
                    label: '0.1%',
                    value: 0.1,
                },
                {
                    label: '0.5%',
                    value: 0.5,
                },
                {
                    label: '1%',
                    value: 1,
                },
            ],
        };
    },
    computed: {
        ...mapState(['tolerance']),
        languages() {
            return Languages;
        },
        minute: {
            get: function () {
                return this.$store.state.minute;
            },
            set: function (val) {
                console.log(this.$store.state.minute, 'this.$store.state.minute;');
                this.$store.commit('setMinute', val);
            },
        },
    },
    methods: {
        setLang(locale) {
            this.$i18n.locale = locale;
            this.$store.commit('setLanguage', locale);
            localStorage.setItem('lang', locale);
        },
        toggle() {
            this.active = !this.active;
        },
        radioChange(val) {
            this.form.rate = val;
            this.change(val);
        },
        change(val) {
            console.log(val, 'val');
            this.$store.commit('setTolerance', val);
        },
    },
    mounted() {

    },
};
</script>

<style lang="less" scoped>
    .wrapper {
        padding: 10px;
        border-radius: 50%;
        //display: inline-flex;
        cursor: pointer;
        display: flex;
        margin-right: 5px;
        position: absolute;
        z-index: 2;
        top: -13px;
        right: 0;
        transition: all .2s;

        &.active,
        &:hover {
            background-color: var(--col-main-1);

            .icon-config {
                color: var(--col-main);
                opacity: 1;
            }
        }

        .icon-config {
            font-size: 20px;
            color: var(--col-main);
            opacity: .6;
        }
    }

    .root {
        font-size: 16px;
        color: var(--col-main-active);

        .title {
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 20px;
        }

        .info {
            margin-bottom: 20px;
            display: flex;
            align-items: center;

            .tip {
                margin-right: 20px;
            }

            .icon {
                font-size: 16px;
            }
        }

        .form-group {
            display: flex;
            align-items: center;
        }

        .radio {
            width: 60px;
            cursor: pointer;
            background-color: #383a3a;
            height: 100%;
            border-radius: 20px;
            line-height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #6c6c6c;

            &.active {
                color: #1e2226;
                background-color: var(--col-main);
            }
        }

        .languages {
            display: inline-flex;

            & img {
                border-radius: 50%;
                border: 3px solid transparent;
                margin-right: 10px;

                &.active {
                    border-color: var(--col-main);
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
</style>
