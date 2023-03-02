<template>
    <view class="nav-box">
        <view class="justify-between nav-bar padding-lr" :style="{background: background,'box-shadow':background=='#fff' ? '0px 0 10.42rpx rgba(0, 0, 0, 0.1)' : ''}">
            <view class="title-item" @click="goBack">
                <u-icon v-if="isGoBack" name="arrow-left" size="20" bold color="#333"></u-icon>
                <slot name="left"></slot>
            </view>
            <view class="title title-item flex align-center center">

                {{title}}
            </view>
            <view class="right title-item justify-end">
                <slot name="right"></slot>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    // 图标
    name: "custom-nav-bar",
    props: {
        background: {
            type: String,
            default: 'linear-gradient(to top, #F4F8FB, #BEEAE3) '// 可选 transparent 或颜色值
        },
        title: {
            type: String,
            default: ""
        },
        isGoBack: {
            type: Boolean,
            default: true
        },
        isGoToBack: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {};
    },
    methods: {
        // 点击触发图标
        goBack() {
            if (this.isGoBack) {
                if (this.isGoToBack) {
                    this.$router.back();
                } else {
                    this.$emit("goBack");
                }
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.nav-box {
    height: 70px;
    .title-item {
        width: 33%;
    }
    .right {
    }
}

.nav-bar {
    height: 70px;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    z-index: 10;
    .title {
        font-weight: 700;
        color: #333333;
        font-size: 16px;
        .u-icon {
            margin-right: 10px;
            margin-top: 1px;
        }
    }
}
</style>
