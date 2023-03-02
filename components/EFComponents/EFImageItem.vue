<template>
	<view class="img-icon">
		<u--image :src="urls" :fade="false" :duration="0" :lazyLoad="false" width="45" height="45" :radius="3">
			<template v-slot:loading>
				<u-loading-icon color="#12b19e"></u-loading-icon>
			</template>
			<view slot="error" class="error">加载失败</view>
		</u--image>
		<view @click.stop="toDelete" v-if="!disabled">
			<u-icon class="move" name="minus-circle-fill" color="red"></u-icon>
		</view>
	</view>
</template>

<script>
import {
    imgUrl
} from "@/config"
import {uploadFile} from "@/untils/request.js"
export default {
    name: "EFImageItem",
    props: {
        value: {
            type: String | Object,
            default: ""
        },
        disabled: {
		    type: Boolean,
		    default: false
        }
    },
    data() {
        return {
            urls: ""
        }
    },
    mounted() {
        this.getInfo()
    },
    methods: {
        getInfo() {
            if(this.value){
                if(typeof this.value =='object'){
                    return this.urls = this.value.path
                }
                this.$http(this.$API.warehouse.file.list + `/${this.value}`, {}, {
				    method: 'get'
                }).then((res) => {
				    this.urls = imgUrl + res?.data?.url
                }).catch(()=>{
					this.urls = imgUrl
				})
            }
        },
        updateFile(){
		    return new Promise((resolve)=>{
		        if(typeof this.value =='object'){
		            uploadFile(this.$API.warehouse.file.add,{
		                file:this.value,
		                filePath:this.value.path,
		                fileType:"image",
		                name:"files"
		            }).then(res=>{
                        const id = res.data.map(item=>item.id).join();
                        resolve(id)
                    })
		        }else{
		            resolve(this.value)
		        }
		    })
        },
        toDelete(){
            this.$emit("toDelete",this.value)
        }
    }
}
</script>
<style scoped lang="scss">
	.img-icon {
		width: 45px;
		height: 45px;
		border-radius: 5.56rpx;
		margin-right: 10rpx;
		display: inline-block;
		position: relative;
		z-index: 9;
		// box-shadow: 0 0 5px rgb(0 0 0 / 5%);
		.move{
			position: absolute;
			top: -5px;
			right: -5px;
			background-color: #fff;
			border-radius: 50%;
			z-index: 10;
		}
	}
	.error{
		text-align: center;
		font-size: 10px;
	}
</style>
