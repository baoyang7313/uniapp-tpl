<template>
  <view>
    <u-popup :show="popupShow" @close="close" :round="30">
      <view class="popup">
        <view class="center popup_down" @click="close">
          <image src="@/static/images/arrow-down.png"></image>
        </view>
        <view class="padding">
          <view class="title">任务</view>
        </view>
        <u-grid :border="false" :col="4">
          <u-grid-item
            v-for="(baseListItem, baseListIndex) in baseList"
            :key="baseListIndex"
            @click="goTo(baseListItem)"
          >
            <view class="img-icon center">
              <image :src="baseListItem.imageIcon"></image>
            </view>
            <text class="grid-text">{{ baseListItem.title }}</text>
          </u-grid-item>
        </u-grid>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      popupShow: false,
      isTabFixed: true,
      baseList: [
        // {
        // 	title: "设备出入库",
        // 	imageIcon: "../../static/images/sbcr.png",
        // 	url: "pages/task/stockInAndStockOut/index",
        // },
        // {
        // 	title: "设备维保",
        // 	imageIcon: "../../static/images/sbwb.png",
        // },
        // {
        // 	title: "设备校验",
        // 	imageIcon: "../../static/images/sbjy.png",
        // },
        // {
        // 	title: "人员出入",
        // 	imageIcon: "../../static/images/rycr.png",
        // 	url: "pages/task/personnelAccess/index",
        // },
        // 领用管理 adoptionManagement
        {
        	title: "领用管理",
        	imageIcon: "../../static/images/popup/adoptionManagement.png",
            url: "pages/task/adoptionManagement/index",
        },
        // 维保管理 MaintenanceManagement
        {
          title: "维保管理",
          imageIcon: "../../static/images/popup/MaintenanceManagement.png",
          url: "pages/task/MaintenanceManagement/index",
        },

        // 检测记录 detectRecording
        // {
        // 	title: "检测记录",
        // 	imageIcon: "../../static/images/popup/detectRecording.png",
        //     url: "pages/task/detectRecording/index",
        // },
        // 报废管理 scrapManagement
        {
          title: "报废管理",
          imageIcon: "../../static/images/popup/scrapManagement.png",
          url: "pages/task/scrapManagement/index",
        },
        // 故障缺陷管理 faultFlaw
        {
          title: "故障缺陷管理",
          imageIcon: "../../static/images/popup/faultFlaw.png",
          url: "pages/task/faultFlaw/index",
        },
        // 校验记录 verifyRecording
        {
          title: "校验记录",
          imageIcon: "../../static/images/popup/verifyRecording.png",
          url: "pages/task/verifyRecording/index",
        },
      ],
    };
  },
  mounted() {
    // 动态插入 把第三个tab遮住
    const div = document.createElement("div");
    div.style.cssText =
      "position: fixed;width: 25vw;height: 50px;z-index: 1000;bottom: 0;left: 50%;transform: ";
    div.onclick = () => {
      this.tabHanlder();
    };
    document.querySelector(".uni-tabbar")?.appendChild(div);
  },
  methods: {
    goTo(item) {
      this.close();
      uni.$u.route(item?.url);
    },
    // 点击弹出框
    close() {
      this.popupShow = false;
    },
    tabHanlder() {
      this.popupShow = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.popup {
  padding-bottom: 30px;

  .popup_down {
    padding-top: 15px;

    image {
      width: 24px;
      height: 10px;
    }
  }

  .title {
    font-weight: 700;
    color: #333333;
    font-size: 15px;
     text-align:center;
  }

  .img-icon {
    width: 50px;
    height: 50px;
    background-color: #D0F0EB;
    border-radius: 50%;

    image {
      width: 25px;
      height: 25px;
    }
  }

  .grid-text {
    color: #666666;
    font-size: 13px;
    margin-top: 10px;
  }
}
</style>
