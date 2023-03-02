<template>
  <view>
    <view @click="save()" v-show="computedDisble">
      <slot>
        <view class="add">
          <view class="center" style="height: 100%">
            <u-icon name="camera-fill" color="#D3D4D6" size="25"></u-icon>
          </view>
        </view>
      </slot>
    </view>
    <!-- 图片回旋 -->
    <view class="img-box">
      <text style="color: #999" v-if="filelist.length == 0 && disabled"
        >暂无</text
      >
      <view class="flex flex-col">
        <EFFileUploaditem
          style="margin-right: 20rpx"
          @delFileItem="delFileItem"
          :disabled="computedDisble"
          :delBtnDisabled="computedDelBtn"
          :cuurenI="i"
          v-for="(item, i) in filelist"
          :value="item"
          :key="item"
        />
      </view>
    </view>
  </view>
</template>

<script>
// import { uploadFile } from "../../untils/request";
import { imgUrl } from "@/config";
import EFFileUploaditem from "./EFFileUploaditem.vue";
export default {
  components: {
    EFFileUploaditem,
  },
  model: {
    // prop: "value", // 默认是value
    event: "loadFile", // 默认是input
  },
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      // required: true,
      default: "/warehouse/file/upload",
    },
    /**
     * 限制文件上传数量
     * */
    count: {
      type: Number,
      default: 1000,
    },
    /**
     * 限制文件上传类型
     */
    extension: {
      type: Array,
      // default:""
    },
    /**
     * 选择文件类型
     */
    chooseType: {
      type: String,
      default: "all",
      validator: (val) => {
        return ["all", "video", "image"].includes(val);
      },
    },
    //文件的id用于回显
    ids: {
      type: String,
      default: "",
    },
  },
  created() {
    this.type = this.$route.query.type;
    console.log(this.ids, 9999);
  },
  computed: {
    //是否显示上传按钮
    computedDisble() {
      if (this.type === "details") return false;
      return this.filelist.length < this.count && this.disabled;
    },
    //是否显示上传按钮
    computedDelBtn() {
      if (this.type === "details") return false;
      return this.disabled;
    },
  },
  data() {
    return {
      filelist: [],
      type: "",
    };
  },
  // 监听抛出去这个方法再次监听到
  watch: {
    // id变化的时候，需要重新赋值
    ids(val) {
      if (!val) return;
      console.log(val, "val-----");
      this.filelist = val.split(",");
    },
  },
  methods: {
    delFileItem(i) {
      this.filelist.splice(i, 1);
    },
    save() {
      // 选择图片文件
      uni.chooseFile({
        count: this.count,
        type: this.chooseType,
        extension: this.extension,
        success: (res) => {
          res.tempFilePaths.forEach((element) => {
            console.log(this.url, "his.url");
            // uploadFile(this.url, {
            //   filePath: element,
            //   name: "files",
            // }).then((res) => {
            //   res.data.map((item) => this.filelist.push(item.id));
            //   this.$emit("loadFile", this.filelist.join(","));
            // });
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
}
.flex-col {
  flex-direction: column;
}
.add {
  background-color: #f4f5f7;
  width: 45px;
  height: 45px;
  border-radius: 5.56rpx;
  margin-right: 10rpx;
  display: inline-block;
  overflow: hidden;
}
</style>
