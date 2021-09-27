<template>
    <div class="legend">
        <a-icon type="icon-circle"/>
        <div class="title">{{ title }}</div>
        <div class="value">{{ value }} {{ token }}</div>
    </div>
</template>

<script>
export default {
    name: 'Legend',
    props: ['value', 'title', 'token'],
};
</script>

<style lang="less" scoped>
.legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--col-borrow);

    & > *:not(:last-child) {
        margin-bottom: 20px;
    }

    .title {
        font-size: 16px;
        color: var(--col-label);
    }

    .value {
        font-size: 30px;
        font-weight: 600;
    }
}

@media (min-width: 960px) {
    .legend {
        & > *:not(:last-child) {
            margin-bottom: 20px;
        }

        .title {
            font-size: 16px;
        }

        .value {
            font-size: 30px;
        }
    }
}
</style>
