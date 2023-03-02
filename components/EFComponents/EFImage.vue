<template>
	<view v-img>
		<EFImageItem v-for="(item) in newValue" :key="item" :value="item" @toDelete="toDelete" :disabled="disabled" />
		<EFImageItem v-for="(item) in fileList" :key="item.path" :value="item" ref="_EFImageItem" @toDelete="toDelete" :disabled="disabled" />
		<text style="color: #999;" v-if="newValue.length==0 && disabled">暂无图片</text>
		<view class="add" @click="chooseImage" v-if="!disabled">
			<view class="center" style="height: 100%;">
				<u-icon name="camera-fill" color="#D3D4D6" size="25"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
import EFImageItem from "./EFImageItem.vue";

function getImages(imgs) {
    let urls = [];
    imgs.forEach(item => {
        const img = item.querySelector("img");
        urls.push(img.src);
    })
    return urls;
}

function getImgs(el) {
    const imgs = el.querySelectorAll(".img-icon")
    imgs.forEach((item, index) => {
        item.addEventListener("click", function() {
            uni.previewImage({
                current: index,
                loop: true,
                urls: getImages(imgs),
                indicator: "default"
            })
        })
    })
}
export default {
    components: {
        EFImageItem
    },
    props: {
        value: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        newValue() {
            if (this.value && typeof this.value == 'string') {
                const myValue = this.value.split(",")
                return myValue;
            }
            return []
        }
    },
    data(){
        return {
            fileList:[],
			deleteList:[]
        }
    },
    methods: {
        chooseImage() {
            uni.chooseImage({
                success: (res) => {
                    this.fileList.push(...res.tempFiles)
                }
            })
        },
        updateFile(){
		    return new Promise((resolve)=>{
                let upArray = [];
		        this.$refs._EFImageItem?.forEach(item=>{
                    upArray.push(item.updateFile())
                })
                Promise.all(upArray).then(res=>{
                    this.$emit("input",[...this.newValue,...res].join())
                    this.fileList = [];
                    resolve([...this.newValue,...res])
                })
		    })
        },
		deleteFile(){
			this.deleteList.forEach(id=>{
				this.$http(this.$API.warehouse.file.list+`/${id}`,{},{method:'DELETE'})
			})
		},
        toDelete(item){
            if(typeof item == 'object'){
                const index = this.fileList.findIndex(item=>item==item)
                this.fileList.splice(index,1)
				console.log(this.fileList,99);
            }else{
				this.deleteList.push(item);
				const index = this.newValue.findIndex(o=>o==item);
				this.newValue.splice(index,1)
				this.$emit("input",this.newValue.join())
			}
        }
    },
    directives: {
        // 自定义预览图片指令
        img: {
            inserted(el) {
                getImgs(el);
            },
            componentUpdated(el) {
                setTimeout(() => {
                    getImgs(el);
                }, 0)
            }
        }
    }
}
</script>
<style scoped lang="scss">
	.add {
		background-color: #F4F5F7;
		width: 45px;
		height: 45px;
		border-radius: 5.56rpx;
		margin-right: 10rpx;
		display: inline-block;
		overflow: hidden;
	}
</style>
