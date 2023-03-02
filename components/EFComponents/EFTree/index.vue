<template>
  <u-popup :show="show" :round="10" mode="bottom" @close="close" @open="open">
    <view class="btn-box">
      <view>
        <u--text
          type="info"
          :size="16"
          @tap="handleClose"
          text="取消"
        ></u--text>
      </view>
      <view>
        <u--text
          type="primary"
          :size="16"
          @tap="handleConfirm"
          text="确定"
        ></u--text>
      </view>
    </view>
    <scroll-view :scroll-y="true" :style="{ height: appWrapperHeight }">
      <ly-tree v-bind="$attrs" v-on="$listeners" @check="handleCheck" />
    </scroll-view>
  </u-popup>
</template>
<script>
import LyTree from "@/components/ly-tree/ly-tree.vue";
export default {
  name: "EFTree",
  components: {
    LyTree,
  },
  data() {
    return {
      show: false,
      appWrapperHeight: "70vh",
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 3,
              label: "二级 2-1",
              children: [
                {
                  id: 4,
                  label: "三级 3-1-1",
                },
                {
                  id: 5,
                  label: "三级 3-1-2",
                },
              ],
            },
            {
              id: 2,
              label: "二级 2-2",
              children: [
                {
                  id: 6,
                  label: "三级 3-2-1",
                },
                {
                  id: 7,
                  label: "三级 3-2-2",
                },
              ],
            },
          ],
        },
        {
          id: 21,
          label: "一级 21",
          children: [
            {
              id: 23,
              label: "二级 2-2-1",
              children: [
                {
                  id: 24,
                  label: "三级 2-3-1-1",
                },
                {
                  id: 25,
                  label: "三级 2-3-1-2",
                },
              ],
            },
            {
              id: 22,
              label: "二级 2-2-2",
              children: [
                {
                  id: 26,
                  label: "三级 2-3-2-1",
                },
                {
                  id: 27,
                  label: "三级 2-3-2-2",
                },
              ],
            },
          ],
        },
        {
          id: 31,
          label: "一级 31",
          children: [
            {
              id: 33,
              label: "二级 3-2-1",
              children: [
                {
                  id: 34,
                  label: "三级 3-3-1-1",
                },
                {
                  id: 35,
                  label: "三级 3-3-1-2",
                },
              ],
            },
            {
              id: 32,
              label: "二级 3-2-2",
              children: [
                {
                  id: 36,
                  label: "三级 3-3-2-1",
                },
                {
                  id: 37,
                  label: "三级 2-3-2-2",
                },
              ],
            },
          ],
        },
      ],
      selectedData: {},
    };
  },
  methods: {
    //选中的数据
    handleCheck(node) {
      this.selectedData = node.checkedNodes;
      console.log(this.selectedData, "this.selectedData");
    },
    //取消
    handleClose() {
      this.selectedData.length = 0;
      this.$emit("close");
      this.close();
    },
    //确认
    handleConfirm() {
      this.$emit("confirm", this.selectedData);
      this.close();
    },
    //弹出层打开
    open() {
      this.show = true;
      // console.log('open');
    },
    close() {
      // 弹出层关闭
      this.show = false;
      // console.log('close');
    },
  },
};
</script>

<style>
.btn-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
}
</style>
