<template>
<div class="_project-rules">
    <h3>{{$t('Ifo.rule1')}}?</h3>

    <div class="_rules-card">
        <h5><span>1</span>{{$t('Ifo.rule2')}}</h5>
        <p v-html="$t('Ifo.rule3')"></p>
        <div class="_route-link">
            <router-link :to="{name: 'SwapIndex'}">
                {{$t('Ifo.rule4')}}
                <a-icon type="icon-third-party" class="icon"/>
            </router-link>
            <router-link :to="{name: 'SwapPool'}">
                {{$t('Ifo.rule5')}}
                <a-icon type="icon-third-party" class="icon"/>
            </router-link>
        </div>
    </div>

    <div class="_rules-icon">
        <span>
            <a-icon type="icon-down" class="icon"/>
        </span>
    </div>

    <div class="_rules-card">
        <h5><span>2</span>{{$t('Ifo.rule6')}}</h5>
        <p>{{$t('Ifo.rule7')}}</p>
    </div>

    <div class="_rules-icon">
        <span>
            <a-icon type="icon-down" class="icon"/>
        </span>
    </div>


    <div class="_rules-card">
        <h5><span>3</span>{{$t('Ifo.rule8')}}</h5>
        <p>{{$t('Ifo.rule9')}}</p>
    </div>


    <!--    <div class="_rules-txt">-->
    <!--        <h5>{{$t('Ifo.rule10')}}</h5>-->
    <!--        <p v-html="$t('Ifo.rule11')"></p>-->
    <!--    </div>-->
</div>
</template>

<script>
export default {
    name: 'project-rules'
}
</script>

<style scoped lang="less">
    ._project-rules {
        display: flex;
        flex-wrap: wrap;
        padding: 30px 40px;
        border-top: 1px solid rgba(#ffffff, .1);
        color: #ffffff;
        margin-top: 50px;

        ._rules-card {
            border-radius: 14px;
            width: 270px;
            height: 200px;
            background-color: #2C3035;
            padding: 18px;
        }

        ._rules-icon {
            height: 200px;
            width: 97px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;

            & > span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #E8B941;
                color: #1F2226;

                .icon {
                    transform: rotate(-90deg);
                }
            }
        }

        h3 {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 50px;
            width: 100%;
        }

        h5 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 15px;
            color: #E8B941;
            margin-top: 0;

            span {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #E8B941;
                color: #1F2226;
                margin-right: 10px;
            }
        }

        p {
            font-size: 12px;
            line-height: 16px;
            font-weight: 300;
            margin-bottom: 20px;
        }

        ._route-link {
            display: flex;

            a {
                display: flex;
                align-items: center;
                color: #F0B80B;
                font-size: 12px;
                font-weight: 500;
                margin-right: 35px;

                &:nth-last-child(1) {
                    margin-right: 0;
                }

                .icon {
                    width: 12px;
                    margin-left: 6px;
                }
            }
        }

        ._rules-txt {
            border-top: 1px solid rgba(#ffffff, .1);
        }
    }

    @media (max-width: 768px) {
        ._project-rules {
            ._rules-icon {
                width: 100%;
                height: 80px;
                & > span {
                    .icon {
                        transform: rotate(0deg);
                    }
                }
            }

            ._rules-card {
                width: 100%;
            }

            p {
                line-height: 24px;
            }
        }
    }
</style>
