<template>
<div class="_project-text">
    <div class="_text">
        <h1>{{$t('Ifo.projectInfo')}}</h1>
        <p>{{desc}}</p>
        <a :href="url" target="_blank"><el-button class="_text-btn">{{$t('Ifo.website')}}</el-button></a>
    </div>
</div>
</template>

<script>
export default {
    name: 'project-text',
    props: ['desc', 'url']
}
</script>

<style scoped lang="less">
    ._project-text {
        ._text {
            padding-top: 30px;
            color: #ffffff;

            h1 {
                margin: 0 0 15px 0;
                font-size: 16px;
                font-weight: 500;
            }

            p {
                font-size: 16px;
                line-height: 24px;
                font-weight: 300;
            }

            ._text-btn {
                background-color: transparent;
                border: 1px solid #F0B80B;
                color: #F0B80B;
                font-size: 16px;
                border-radius: 4px;
            }

            a {
                display: inline-flex;
                margin-top: 20px;
            }

            ._mg-40 {
                margin-bottom: 40px;
            }
        }
    }
</style>
