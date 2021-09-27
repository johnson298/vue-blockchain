<template>
    <div :class="['wrapper', { active: active }]">
        <el-popover
            popper-class="__popover"
            trigger="click"
            @show="toggle"
            @hide="toggle"
            :visible-arrow="false"
        >
            <a-icon slot="reference" class="icon-config" type="icon-more"/>
            <div class="root">
                <a
                    v-for="d in links"
                    class="link"
                    target="_blank"
                    :href="d.link"
                    :key="d.link"
                >
                    <a-icon class="icon" :type="d.icon"/>
                    <span>{{ $t(d.label) }}</span>
                </a>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    name: 'LinkMore',
    data() {
        return {
            active: false,
            links: [
                {
                    link: 'https://t.me/burgerswap',
                    label: 'linkView.telegraph',
                    icon: 'icon-telegram',
                    pc: true,
                },
            ],
        };
    },
    methods: {
        toggle() {
            this.active = !this.active;
        },
    },
    mounted() {
        this.$swap.chainId().subscribe(() => {
            this.links = [
                {
                    link: 'https://medium.com/p/ac19287b5a2a/edit',
                    label: 'linkView.About',
                    icon: 'icon-about',
                    pc: true,
                },
                {
                    link: 'https://github.com/burgerswap-org/burgerswap-core',
                    label: 'linkView.Code',
                    icon: 'icon-code',
                    pc: true,
                },
                {
                    link:
                        'https://www.bscscan.com/address/0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
                    label: 'linkView.Contract',
                    icon: 'icon-contract',
                    pc: true,
                },
                {
                    link: 'https://t.me/burgerswap',
                    label: 'linkView.telegraph',
                    icon: 'icon-telegram',
                    pc: true,
                },
                {
                    link: 'https://doc.burgerswap.org/',
                    label: 'linkView.doc',
                    icon: 'contract',
                    pc: true,
                },
                {
                    link: 'https://cb.burgerswap.org/',
                    label: 'linkView.cross',
                    icon: 'contract',
                    pc: true,
                },
            ];
        });
    },
};
</script>

<style lang="less" scoped>
.wrapper {
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    margin-right: 5px;

    &.active {
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
    font-size: 18px;
    color: var(--color-font);

    .link {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: var(--col-main-active);

        & span {
            font-weight: bold;
        }

        &:hover {
            color: var(--col-main);
        }
    }

    .icon {
        color: var(--col-main);
        font-size: 18px;
        margin-right: 10px;
    }
}
</style>
