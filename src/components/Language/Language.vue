<template>
<el-dropdown trigger="click" @command="command">
    <div class="language">
        {{langList[lang]}}
        <a-icon class="icon-arrow" type="triangle"/>
    </div>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh">
            {{$t('Main.Zh')}}
        </el-dropdown-item>
        <el-dropdown-item command="en">
            {{$t('Main.En')}}
        </el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
</template>

<script>
export default {
    name: 'Language',
    props: ['drawer'],
    data() {
        return {
            lang_show: false,
            langList: {
                zh: this.$t('Main.Zh'),
                en: this.$t('Main.En'),
            },
            lang: localStorage.getItem('lang') || 'en',
        }
    },
    methods: {
        command(locale) {
            this.lang = locale;
            this.$i18n.locale = locale;
            localStorage.setItem('lang', locale);
        },
    }
};
</script>

<style lang="less" scoped>
    .language {
        display: flex;
        color: var(--col-font);
    }

    .icon-arrow {
        margin-left: 10px;
        color: var(--col-font);
    }
</style>
