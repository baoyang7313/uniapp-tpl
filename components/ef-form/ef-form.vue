<template>
  <view class="my-form">
    <u--form
      :model="rules ? model : {}"
      ref="formDom"
      :rules="rules || {}"
      labelWidth="auto"
      :labelStyle="{ 'margin-right': '30rpx' }"
    >
      <view
        class="form-contaniner"
        v-for="(item, index) in options.data || []"
        :key="index"
      >
        <view class="title" v-if="item.title">{{ item.title }}</view>
        <u-line color="#EDEDED"></u-line>
        <!-- 申请人插槽 -->
        <!-- <template v-if="options.hasOwnProperty('dataSlot')&&index==options.dataSlot.slotIndex">
                    <slot :name="options.dataSlot.slotName"></slot>
                </template> -->
        <template v-for="(child, childIndex) in item.list || []">
          <!-- 文本域 -->
          <template v-if="child.type == 'textarea'">
            <u-form-item
              :label="child.name"
              :prop="child.key"
              :required="child.required"
              :key="childIndex"
              :labelWidth="child.labelWidth"
            >
            </u-form-item>
            <view :key="childIndex + 't'">
              <u--textarea
                class="textarea"
                v-model="model[child.key]"
                placeholder="请输入内容"
                :disabled="getIsAbled(child)"
              ></u--textarea>
              <view style="height: 13px"></view>
              <u-line
                color="#EDEDED"
                v-if="childIndex + 1 < item.list.length ? true : false"
              ></u-line>
            </view>
          </template>
          <u-form-item
            v-else
            :label="child.name"
            :borderBottom="childIndex + 1 < item.list.length ? true : false"
            :prop="child.key"
            :required="child.required"
            :key="childIndex"
            :labelWidth="child.labelWidth"
          >
            <!-- tree下拉选择 -->
            <view
              class="flex1"
              v-if="child.type == 'tree'"
              @click="handleTree(child)"
            >
              <u--input
                :value="getCodeToName(model[child.key], child)"
                border="none"
                placeholder="请选择"
                disabled
                disabledColor="#fff"
              >
              </u--input>
              <u-icon
                v-if="!getIsAbled(child)"
                class="right-icon"
                v-slot="right"
                name="arrow-down"
                color="#bcc1c9"
              ></u-icon>
            </view>

            <!-- 下拉框 -->
            <view
              class="flex1"
              v-if="child.type == 'select'"
              @click="selectHandler(child)"
            >
              <u--input
                :value="getCodeToName(model[child.key], child)"
                border="none"
                placeholder="请选择"
                disabled
                disabledColor="#fff"
              >
              </u--input>
              <u-icon
                v-if="!getIsAbled(child)"
                class="right-icon"
                v-slot="right"
                name="arrow-down"
                color="#bcc1c9"
              ></u-icon>
            </view>

            <!-- 选择时间 -->
            <view
              class="flex1"
              v-else-if="child.type == 'datetime'"
              @click="dateTimeHandler(child, childIndex)"
            >
              <u--input
                v-model="model[child.key]"
                border="none"
                placeholder="请选择时间"
                disabled
                disabledColor="#fff"
              >
              </u--input>
              <u-icon
                class="right-icon"
                v-slot="right"
                name="calendar"
                color="#bcc1c9"
                size="22"
              >
              </u-icon>
              <!-- 时间选择器 -->
              <u-datetime-picker
                :ref="'dataTimePicker' + childIndex"
                :show="dataeTimeShow"
                v-model="dateTime"
                :mode="child.mode || 'datetime'"
                :formatter="formatter"
                closeOnClickOverlay
                @close="pickerClose"
                @cancel="pickerClose"
                @confirm="dateTimeConfirm"
                :maxDate="child.maxDate"
              >
              </u-datetime-picker>
            </view>

            <!-- 图片 -->
            <view class="flex1" v-else-if="child.type == 'image'">
              <view class="img-top">
                <EFImage
                  v-model="model[child.key]"
                  :disabled="getIsAbled(child)"
                  ref="_EFImage"
                />
              </view>
            </view>
            <!-- 上传文件 -->
            <view class="flex1" v-else-if="child.type == 'upload'">
              <view class="img-top">
                <EFFileUpload
                  :ids="model[child.key]"
                  v-model="model[child.key]"
                  :disabled="getIsAbled(child)"
                  :count="count"
                  :extension="child.extension"
                />
              </view>
            </view>
            <!-- radio -->
            <view class="flex1" v-else-if="child.type == 'radio'">
              <u-radio-group
                v-model="model[child.key]"
                activeColor="#12b19e"
                :disabled="getIsAbled(child)"
              >
                <view class="flex1 radio-box">
                  <u-radio
                    :key="index"
                    :label="item[child.label]"
                    v-for="(item, index) in child.resList || []"
                    :name="item[child.id]"
                  >
                  </u-radio>
                </view>
              </u-radio-group>
            </view>

            <!-- 输入框 -->
            <u--input
              v-else-if="child.type == 'text'"
              maxlength="30"
              v-model="model[child.key]"
              border="none"
              :disabled="getIsAbled(child)"
              disabledColor="#fff"
              placeholder="请输入"
            >
            </u--input>

            <!-- 搜素下拉 -->
            <view class="flex1" v-else-if="child.type == 'filterText'">
              <EFFilterText
                v-model="model[child.key]"
                @change="filterTextChange($event, child)"
                :disabled="getIsAbled(child)"
                :child="child"
              />
            </view>
          </u-form-item>
        </template>
      </view>
      <view
        class="center bottom"
        v-if="[TAction.add, TAction.edit, TAction.inspection].includes(type)"
        v-show="showNone"
      >
        <!-- {{[[TAction.add, TAction.edit,TAction.inspection].includes(type)]}} -->
        <u-button text="取消" @click="calce" class="btncircle"></u-button>
        <!-- linear-gradient(270deg,#12b19e 0%,#12ceb8 100%) -->
        <u-button
          text="保存"
          @click="save"
          class="btncircle"
          color="linear-gradient(90deg,#00a7a8 0%,#00b893 100%)"
        ></u-button>
      </view>
    </u--form>
    <!-- 选择器 -->
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
    >
    </u-picker>
    <!-- 树形选择器 -->
    <EFTree
      @confirm="treeConfirm"
      :props="{ label: activeItem.label, isLeaf: false }"
      :node-key="activeItem.id"
      :tree-data="transformTree(resList, 'deptId')"
      :showCheckbox="!!activeItem.showCheckbox"
      :showRadio="!!activeItem.showRadio"
      ref="treeDom"
      :defaultCheckedKeys="[model[activeItem.key]]"
    />
    <!-- 时间选择器 -->
    <!-- <u-datetime-picker ref="dataTimePicker" :show="dataeTimeShow" v-model="dateTime" mode="datetime" :formatter="formatter" closeOnClickOverlay @close="pickerClose" @cancel="pickerClose" @confirm="dateTimeConfirm" :maxDate="Number(new Date())">
        </u-datetime-picker> -->
  </view>
</template>

<script>
import { TAction } from "@/config/dict.js";
import EFImage from "@/components/EFComponents/EFImage.vue";
import EFFilterText from "@/components/EFComponents/EFFilterText.vue";
import EFFileUpload from "@/components/EFComponents/EFFileUpload";
import EFTree from "@/components/EFComponents/EFTree/index.vue";
import { transformTree } from "@/utils/index.js";
export default {
  name: "ef-form",
  components: {
    EFImage,
    EFFilterText,
    EFFileUpload,
    EFTree,
  },
  props: {
    /**
     * 限制文件上传数量
     * */
    count: {
      type: Number,
      default: 1000,
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 过滤需要提交的字段key
     */
    savefilters: {
      type: Array,
      default: (_) => [],
    },
    showNone: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false,
      columns: [],
      activeItem: {},
      dateTime: Number(new Date()),
      // 	用于控制选择器的弹出与收起
      dataeTimeShow: false,
      resList: [],
      // 选择器的加载状态
      pickerLoading: false,
      // 自定义需要展示的text属性键名
      keyName: "",
      // 选择器的各列的默认索引
      pickerIndex: [0],
      model: {},
      type: "",
      TAction,
      disabled: false,
      popupShow: false,
    };
  },
  created() {
    this.type = this.$route.query.type;
    const id = this.$route.query.id;
    this.disabled = this.type == TAction.details;
    // 默认赋值
    const initData = this.options.initData || {};
    this.model = Object.assign(this.model, initData);
    this.getOptionData();
    if (id) {
      this.$http(
        this.options.addUrl + `/${id}`,
        {},
        {
          method: "get",
        }
      ).then((res) => {
        this.model = res.data;
      });
    }
  },
  mounted() {},
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.formDom.setRules(this.rules);
  },
  // watch: {
  // dick: {
  //   handler(val) {
  //     // console.log(val, "dickdick");
  //     this.getOptionData();
  //   },
  //   deep: true,
  //   immediate: true,
  // },
  // },
  methods: {
    transformTree,
    treeConfirm(data) {
      console.log(data, "999");
      let item = data[0];
      const id = this.activeItem["id"] || "id";
      const key = this.activeItem.key;
      const value = item[id];
      this.$set(this.model, key, value);
    },
    // 获取字典接口数据
    getOptionData() {
      const getData = (item) => {
        return this.$store.dispatch("getDick", item).then((res) => {
          item.resList = res;
          // 强制更新
          this.$forceUpdate();
        });
      };
      let proArr = [];
      this.options.data.forEach((list) => {
        list.list.forEach((item) => {
          ["select", "radio", "tree"].includes(item.type) &&
            proArr.push(getData(item));
        });
      });
      // console.log(proArr,'proArr');
      Promise.all(proArr).then(() => {});
    },
    // 打开tree组件
    handleTree(item) {
      console.log(item, "打开tree组件");
      if (this.getIsAbled(item)) return;
      this.$refs.treeDom.open();
      this.activeItem = item;
      this.resList = item.resList;
      // this.keyName = item.label;
    },
    // 下拉框点击
    selectHandler(item) {
      if (this.getIsAbled(item)) return;
      this.show = true;
      this.activeItem = item;
      this.columns = [item.resList];
      this.resList = item.resList;
      this.pickerIndex = [0];
      this.keyName = item.label;
      if (this.model[item.key]) {
        const index = item.resList.findIndex(
          (o) => o[item.id] == this.model[item.key]
        );
        this.pickerIndex = [index];
      }
    },
    // picker确认
    pickerConfirm(e) {
      this.show = false;
      const item = e.value[0];
      const id = this.activeItem["id"] || "id";
      const key = this.activeItem.key;
      const value = item[id];
      this.$set(this.model, key, value);
    },
    // picker关闭
    pickerClose() {
      this.show = false;
      this.dataeTimeShow = false;
    },
    // 时间选择
    dateTimeHandler(item, index) {
      console.log(item, "-----");
      console.log(index, "indexindexindex");
      if (this.getIsAbled(item)) return;
      this.activeItem = item;
      this.dataeTimeShow = true;
      // if (this.model[this.activeItem.key]) {
      //     //时间有时分秒还是日期
      //     this.$nextTick(()=>{
      //         console.log(this.$refs["dataTimePicker" + index],"this.$refs[ + index]=============");
      //     this.$refs["dataTimePicker" + index].updateColumnValue(
      //         this.model[this.activeItem.key]
      //     );
      //     })
      // }
    },
    // 时间确定
    dateTimeConfirm({ value }) {
      this.model[this.activeItem.key] = uni.$u.timeFormat(
        value,
        "yyyy-mm-dd hh:MM:ss"
      );
      this.dataeTimeShow = false;
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
    // 取消
    calce() {
      uni.navigateBack();
    },
    valite() {
      return new Promise((resolve, reject) => {
        this.options.data.forEach((list) => {
          list.list.forEach((item) => {
            if (item.required && !this.model[item.key]) {
              reject();
              uni.showToast({
                icon: "none",
                title: item.name + "未填",
              });
              throw item.name + "未填";
            }
          });
        });
        resolve();
      });
    },
    save() {
      this.valite().then(async () => {
        const method = [TAction.add, TAction.inspection].includes(this.type)
          ? "post"
          : "put";
        const mornData = this.options.mornData || {};
        const _EFImage = this.$refs._EFImage;
        //   const _upload = this.$refs._upload;
        const formData = { ...this.model, ...mornData };
        const filters = Object.keys(formData);
        filters.forEach((item) => {
          if (this.savefilters.includes(item)) {
            delete formData[item];
          }
        });
        // console.log(formData, "aasdasd");
        // return
        console.log(_EFImage, "=====");
        for (let i = 0; i < _EFImage?.length; i++) {
          const item = _EFImage[i];
          await item.updateFile();
        }
        this.$http(this.options.addUrl, formData, {
          method,
        }).then(() => {
          uni.showToast({
            title: "新增成功",
            icon: "none",
          });

          setTimeout(() => {
            this.$refs._EFImage?.forEach((item) => item.deleteFile());
            this.options?.refresh && uni.$emit(this.options?.refresh);
            uni.navigateBack();
          }, 800);
        });
      });
    },
    getCodeToName(value, item) {
      if (!value) return value;
      if (!item.resList) return value;
      const item2 = item.resList.find((o) => o[item.id || "id"] == value);
      if (!item2) return value;
      return item2[item.label || "label"];
    },
    getIsAbled(item) {
      return this.disabled || item.disabled;
    },
    filterTextChange(data, item) {
      if (item.changForm) {
        item.changForm.forEach((citem) => {
          if (typeof citem == "string") {
            this.model[citem] = data[citem];
          } else {
            this.model[citem.newKey] = data[citem.oldKey];
          }
        });
        this.$set(this, "model", this.model);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btncircle {
  border-radius: 12px;
}
::v-deep .u-popup[data-v-3a231fda] {
  flex: 0;
}
::v-deep .u-radio {
  margin-right: 80rpx;
  margin-left: 0 !important;
  margin-bottom: 10rpx;
}
.radio-box {
  flex-wrap: wrap;
  margin-top: 2rpx;
}
.my-form {
  .title {
    color: #2b3b4e;
    font-size: 17px;
    font-weight: 700;
    padding-bottom: 10px;
  }

  .textarea {
    margin-top: -12rpx;
    background-color: #fcfcfc;
  }

  .bottom {
    padding: 14rpx 77rpx 36rpx 77rpx;
  }

  .u-button {
    margin: 0 22rpx;
    height: 96rpx;
  }

  .img-icon {
    width: 90.28rpx;
    height: 90.28rpx;
    border-radius: 5.56rpx;
    margin-right: 10rpx;
  }
}

.right-icon {
  margin-right: 7px;
}

/deep/ .u-form-item__body {
  padding: 13px 0;
}

/deep/ .u-radio + .u-radio {
  margin-left: 50rpx;
}
</style>
