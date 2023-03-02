<template>
  <view>
    <u-row customStyle="flex-wrap:wrap" class="padding select-content">
      <u-col :span="item.span || 4" v-for="(item, index) in menus" :key="index">
        <view
          class="datetime flex1 align-center"
          v-if="item.type == 'time'"
          :key="index"
        >
          <view
            class="center datetime_item"
            @click="dateTimeHandler(item, 'key1')"
          >
            <!-- <u-icon name="calendar" size="20"></u-icon> -->
            <!-- {{ (model[item.key1] | formDate)|| "开始时间" }} -->
            {{ model[item.key1] | formDate("开始时间") }}
          </view>
          <view> 至 </view>
          <view
            class="center datetime_item"
            @click="dateTimeHandler(item, 'key2')"
          >
            <!-- <u-icon name="calendar" size="20"></u-icon> -->
            <!-- {{ model[item.key2] || "结束时间" }} -->
            {{ model[item.key2] | formDate("结束时间") }}
          </view>
        </view>
        <!-- <view
          v-else-if="item.type == 'tree'"
          class="select-item center"
          :key="index + 'key'"
          @click="selectItem(item)"
        >
          <view class="text">{{ getCodeToName(model[item.key], item) }}</view>
          <u-icon name="arrow-down-fill" size="12"></u-icon>
        </view> -->
        <view
          v-else
          class="select-item center"
          :key="index + 'tree'"
          @click="selectItem(item)"
        >
          <view class="text">{{ getCodeToName(model[item.key], item) }}</view>
          <u-icon name="arrow-down-fill" size="12"></u-icon>
        </view>
      </u-col>
      <u-col span="4">
        <view class="select-item center bg-e" @click="handleReLoad">
          <view class="text">重置</view>
          <u-icon name="reload" size="12"></u-icon>
        </view>
      </u-col>
    </u-row>
    <u-picker
      :show="show"
      :loading="pickerLoading"
      :defaultIndex="pickerIndex"
      :keyName="keyName"
      :columns="columns"
      closeOnClickOverlay
      @close="pickerClose"
      @cancel="pickerClose"
      @confirm="pickerConfirm"
    ></u-picker>
    <u-datetime-picker
      :show="dataeTimeShow"
      v-model="dateTime"
      mode="datetime"
      :formatter="formatter"
      closeOnClickOverlay
      @close="pickerClose"
      @cancel="pickerClose"
      @confirm="dateTimeConfirm"
    >
    </u-datetime-picker>
    <!-- 树形选择器 -->
    <EFTree
      @confirm="treeConfirm"
      :props="{ label: activeItem.label, isLeaf: false }"
      :node-key="activeItem.id || 'id'"
      :tree-data="transformTree(resList, 'deptId')"
      :showCheckbox="!!activeItem.showCheckbox"
      :showRadio="!!activeItem.showRadio"
      ref="treeDom"
      :defaultCheckedKeys="[model[activeItem.key]]"
    />
  </view>
</template>

<script>
import EFTree from "@/components/EFComponents/EFTree/index.vue";
import { transformTree } from "@/untils/untils.js";
export default {
  components: {
    EFTree,
  },
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      columns: [],
      show: false,
      activeItem: {},
      dateTime: Number(new Date()),
      dataeTimeShow: false,
      resList: [],
      model: {},
      pickerLoading: false,
      keyName: "",
      pickerIndex: [0],
      timeType: "",
    };
  },
  filters: {
    formDate: function (data, val) {
      if (!data) {
        return val;
      }
      return uni.$u.timeFormat(data, "yyyy-mm-dd");
    },
  },
  methods: {
    transformTree,
    treeConfirm(data) {
      console.log(data, "999");
      console.log(this.activeItem, "activeItem");
      const { showRadio, id, key } = this.activeItem;
      let item = showRadio ? data[0] : data;
      const value = item[id];
      this.model[key] = value;
      console.log(id, "id");
      console.log(key, "key");
      console.log(item, "item");
      console.log(value, "value");

      this.$emit("change", this.model);
      console.log(this.model, "this.model");
      this.$forceUpdate();
    },
    handleReLoad() {
      console.log(this.model);
      const copyModel = {};
      for (const key in this.model) {
        copyModel[key] = undefined;
      }
      this.model = {};
      this.$emit("change", copyModel);
    },
    selectItem(item) {
      console.log(item, "=====item");
      if (item.type == "tree") {
        this.$refs.treeDom.open();
      } else {
        this.show = true;
      }
      this.activeItem = item;
      this.columns = [[]];
      this.pickerLoading = true;
      this.pickerIndex = [0];
      this.$store.dispatch("getDick", item).then((res) => {
        this.pickerLoading = false;
        this.resList = res;
        item.resList = res;
        this.columns = [res];
        this.keyName = item.label;
        if (this.model[item.key]) {
          const index = res.findIndex(
            (o) => o[item.id] == this.model[item.key]
          );
          this.pickerIndex = [index];
        }
      });
    },
    pickerConfirm(e) {
      this.show = false;
      const item = e.value[0];
      const id = this.activeItem["id"] || "id";
      const key = this.activeItem.key;
      const value = item[id];
      this.model[key] = value;
      this.$emit("change", this.model);
    },
    pickerClose() {
      this.show = false;
      this.dataeTimeShow = false;
    },
    // 时间选择
    dateTimeHandler(item, type) {
      console.log(item, "=====");
      this.activeItem = item;
      this.dataeTimeShow = true;
      this.timeType = this.activeItem[type];
      console.log(this.timeType, "this.timeType");
    },
    // 时间确定
    dateTimeConfirm({ value }) {
      this.model[this.timeType] = uni.$u.timeFormat(
        value,
        "yyyy-mm-dd hh:MM:ss"
      );
      this.$set(this.model, this.timeType, this.model[this.timeType]);
      this.dataeTimeShow = false;
      // 这里兼容格网的时间数据
      if (
        (this.model["starTime"] && this.model["endTime"]) ||
        (this.model["startInterval"] && this.model["endInterval"])
      ) {
        if (
          new Date(this.model["starTime"]).getTime() >
          new Date(this.model["endTime"]).getTime() >
          new Date(this.model["startInterval"]).getTime() >
          new Date(this.model["endInterval"]).getTime()
        ) {
          uni.showToast({
            icon: "none",
            title: "开始时间不能小于结束时间",
            duration: 2000,
          });
          this.model["endTime"] = "";
          return;
        }
        this.$emit("change", this.model);
      }
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      if (type === "hour") {
        return `${value}时`;
      }
      if (type === "minute") {
        return `${value}分`;
      }
      return value;
    },
    getCodeToName(value, item) {
      if (!value) return item.name;
      if (!item.resList) return item.name;
      const item2 = item.resList.find((o) => o[item.id || "id"] == value);
      if (!item2) return item.name;
      return item2[item.label || "label"];
    },
  },
};
</script>

<style lang="scss" scoped>
.datetime {
  width: 100%;
}
.bg-e {
  background-color: #eee;
}
.select-content {
  flex-wrap: wrap;
  padding: 34rpx 50rpx;
  .comm {
    color: #666666;
    font-size: 14px;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 40rpx;
    padding: 20rpx 0;
    margin-right: 14.12rpx;
    margin-bottom: 14rpx;
    height: 31px;
    box-sizing: border-box;
    padding: 0 10px;
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .select-item {
    width: 203rpx;
    // height: ;
    // width: 150rpx;
    @extend .comm;

    .u-icon {
      margin-left: 3px;
      position: relative;
      top: 1px;
    }

    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }
  .datetime {
    margin-bottom: 14rpx;
  }
  .datetime_item {
    @extend .comm;
    width: 290rpx;
    // height: 100rpx;
    margin-bottom: 0;
    color: #999;
    &:last-child {
      margin-right: 0;
      margin-left: 14.12rpx;
    }
    .u-icon {
      margin-right: 3px;
      color: #999;
    }
  }
}
</style>
