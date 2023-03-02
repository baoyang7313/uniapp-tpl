<template>
  <ef-scroll-view
    @refresherrefresh="refresherrefresh"
    @crolltolower="crolltolower"
    :refresherTriggered="refresherTriggered"
    :bottomHeight="bottomHeight"
  >
    <view style="overflow: hidden">
      <u-checkbox-group style="flex-direction: column">
        <view
          class="list-item flex1"
          v-for="(item, index) in listData"
          :key="index"
        >
          <view class="radio" v-if="options.radio != false">
            <u-checkbox
              :name="1"
              shape="circle"
              activeColor="#12b19e"
            ></u-checkbox>
          </view>
          <view class="flex1 felx-column">
            <view v-if="!type" class="jump center" @click="toAdd(item)"> 
             <image src="@/static/images/right.png" mode="aspectFit"></image>
          </view> 
               <rudon-rowMenuDotDotDot v-else :localdata="Inlineoptions" @change="menuAction($event,item)" class="jump center">
                    ···
                </rudon-rowMenuDotDotDot> 
            <template v-for="(sitem, sindex) in options.list || []">
              <view
                class="flex1 list-item_li"
                :key="sindex + 's'"
                v-if="!sitem.slot"
              >
                <view class="title">{{ sitem.name }}</view>
                <view>{{ item[sitem.key] || "--" }}</view>
              </view>
              <view class="flex1 list-item_li" :key="sindex + 's'" v-else>
                <view class="title" v-if="sitem.name">{{ sitem.name }}</view>
                <view>
                  <slot :name="sitem.key" v-bind="item" />
                </view>
              </view>
            </template>
          </view>
        </view>
        <u-loadmore :status="status" />
      </u-checkbox-group>
    </view>
  </ef-scroll-view>
</template>

<script>
export default {
  name: "ef-table",
  props: {
    type: {
        type: String,
        default: ''
    },
    /**格式化列表数据回调*/
    formatData: {
      type: Function,
    },
    // 分页数量字段
    pageNumKey: {
      type: String,
      default: "pageNum",
    },
    // 分页大小字段key
    pageSizeKey: {
      type: String,
      default: "pageSize",
    },
    //分页0开始就传1（兼容格网）
    gridPageNum: {
      type: Number,
      default: 0,
    },
    listUrl: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    bottomHeight: {
      type: Number,
      default: 0,
    },
    // 台账行内下拉菜单
    Inlineoptions:{
          type:Array,
            default:()=>[]
    }
  },
  data() {
    return {
      form: {},
      listData: [],
      status: "loading",
      pageNum: 1,
      refresherTriggered: true,
    };
  },
  created() {
    // this.init();
    this.options.refreshKey &&
      uni.$on(this.options.refreshKey, () => {
        this.init();
      });
  },
  beforeDestroy() {
    this.options.refreshKey && uni.$off(this.options.refreshKey);
  },
  methods: {

     menuAction (action, row) {
                // 忽略初始化时的传入的空操作
                if (action === '') {
                    return
                }
                  // 打印看参数  
                this.$emit("menuAction", JSON.stringify({action, row}));
                },

    toAdd(item) {
      this.$emit("toAdd", item);
    },
    // menuAction(item){
    // this.$emit("menuAction", item);
    // },
    initData(form) {
      this.form = Object.assign(this.form, form);
      this.pageNum = 1;
      this.init();
    },
    init() {
      this.refresherTriggered = true;
      this.status = "loading";
      for (let item in this.form) {
        if (this.form[item] === undefined) {
          delete this.form[item];
        }
      }
      console.log(this.form, "init");
      this.$http(
        this.listUrl,
        {
          ...this.form,
          [this.pageNumKey]: this.pageNum - this.gridPageNum,
          [this.pageSizeKey]: 10,
        },

        {
          method: "get",
        }
      ).then((res) => {
        this.refresherTriggered = false;
        //数据格式化
        if (this.formatData && typeof this.formatData === "function") {
          res = this.formatData(res);
        }
        if (this.pageNum === 1) {
          this.listData = res.rows;
        } else {
          this.listData = [...this.listData, ...res.rows];
        }
        this.status = res.total <= this.listData.length ? "nomore" : "loadmore";
      });
    },
    crolltolower() {
      if (this.status == "nomore") return;
      this.pageNum++;
      this.init();
    },
    refresherrefresh() {
      if (this.refresherTriggered) return;
      this.pageNum = 1;
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  background-color: #ffffff;
  border-radius: 14rpx;
  box-shadow: 0px 3.47rpx 10.42rpx rgba(0, 0, 0, 0.05);
  padding: 34rpx;
  box-sizing: border-box;
  margin: 10rpx;
  position: relative;

  .list-item_li {
    margin-bottom: 23rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .title {
    width: 184rpx;
    margin-right: 38rpx;
    color: #89909d;
  }

  .jump {
    width: 79.86rpx;
    height: 39.58rpx;
    background-color: rgba(18, 177, 158, 0.1);
    border-radius: 27.78rpx;
    position: absolute;
    right: 10px;
    top: 15px;

    image {
      width: 25.66rpx;
      height: 21.64rpx;
    }
  }

  .radio {
    margin-right: 10px;
    margin-top: 2px;
  }
}
</style>
