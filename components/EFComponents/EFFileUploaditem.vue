<template>
  <view>
    <view v-if="uploadFileType.includes(fiels.type)" class="imgs mb-10">
      <u-image
        width="80px"
        height="80px"
        @tap="preview"
        :src="fiels.url"
      ></u-image>
      <u-icon
        @tap="handleDel"
        class="delBtn"
        name="minus-circle-fill"
        v-if="delBtnDisabled"
      ></u-icon>
    </view>
    <view v-else class="box mb-10">
      <i :class="['icon iconfont', switchLogo]" class="fs-40"></i>
      <u-text @tap="preview" :text="fiels.name" lines="1"></u-text>
      <u-icon
        @tap="handleDel"
        size="50rpx"
        name="trash"
        v-if="delBtnDisabled"
      ></u-icon>
    </view>
  </view>
</template>

<script>
import { imgUrl, UPLOAD_FILE_TYPES } from "@/config";
import uImage from "../../uni_modules/uview-ui/components/u--image/u--image.vue";
export default {
  components: { uImage },
  name: "EFFileUploaditem",
  props: {
    /**
     * d
     */
    cuurenI: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 删除按钮
    delBtnDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fiels: {},
      urls: "",
      uploadFileType: Object.freeze(UPLOAD_FILE_TYPES.image),
    };
  },
  mounted() {},
  computed: {
    // 文件类型
    switchLogo() {
      switch (this.fiels.type) {
        case "doc":
        case "docx":
          return "icon-DOC";
        case "ppt":
        case "pptx":
          return "icon-ppt";
        case "xls":
        case "xlsx":
          return "icon-xls";
        case "pdf":
          return "icon-pdf";
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        if (!val) return;
        this.getInfo();
      },
      immediate: true,
    },
  },
  methods: {
    handleDel() {
      this.$emit("delFileItem", this.cuurenI);
    },
    preview() {
      // 文件
      if (UPLOAD_FILE_TYPES.files.includes(this.fiels.type)) {
        console.log("文件");
        uni.openDocument({
          filePath: this.fiels.url,
          showMenu: true,
          success: function (res) {
            console.log("打开文档成功");
          },
        });
      } else if (UPLOAD_FILE_TYPES.image.includes(this.fiels.type)) {
        //图片
        console.log("图片");
        uni.previewImage({
          current: 0,
          loop: true,
          urls: [this.fiels.url],
          indicator: "default",
        });
      }
    },
    getInfo() {
      if (this.value) {
        this.$http(
          `${this.$API.warehouse.file.list}/${this.value}`,
          {},
          {
            method: "get",
          }
        )
          .then((res) => {
            const { fileExt, id, url, fileName } = res.data;
            this.fiels = {
              id,
              url: imgUrl + url,
              type: fileExt.toLowerCase(),
              name: fileName,
            };
            // this.fiels= res.data.fileExt;
            // this.fiels= res.data.id;
            //   res.data.id=id
            // res.data.url=url
            console.log(this.fiels, "res================>res");
            this.urls = imgUrl + res?.data?.url;
          })
          .catch(() => {
            this.urls = imgUrl;
          });
      }
    },
    toDelete() {
      this.$emit("toDelete", this.value);
    },
  },
};
</script>
<style scoped lang="scss">
.mb-10 {
  margin-top: 20rpx;
}
.img-icon {
  width: 45px;
  height: 45px;
  border-radius: 5.56rpx;
  margin-right: 10rpx;
  display: inline-block;
  position: relative;
  z-index: 9;
  .move {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #fff;
    border-radius: 50%;
    z-index: 10;
  }
}
.error {
  text-align: center;
  font-size: 10px;
}
.box {
  display: flex;
  justify-content: flex-start;
}
.fs-40 {
  font-size: 40rpx;
  margin-right:10rpx
}
.imgs {
  position: relative;
}
.delBtn {
  position: absolute;
  top: 0;
  right: -10rpx;
}
</style>
