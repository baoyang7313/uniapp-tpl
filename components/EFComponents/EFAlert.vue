<template>
	<u-popup :show="popupShow" @close="close" mode="center" :round="10">
		<view class="cur-popup">
			<view class="justify-end" @click="close">
				<image class="close" src="@/static/images/close.png"></image>
			</view>
			<view class="content">
				<view class="center" style="margin-bottom: 30rpx;">
					<image class="title-icon" src="@/static/images/fault.png" mode="aspectFit"></image>
					<view class="title">故障警告！</view>
				</view>
				<view>
					<image class="list-img" src="@/static/images/menu/equi-active.png" mode="aspectFit"></image>
					<image class="list-img" src="@/static/images/menu/equi-active.png" mode="aspectFit"></image>
					<image class="list-img" src="@/static/images/menu/equi-active.png" mode="aspectFit"></image>
					<image class="list-img" src="@/static/images/menu/equi-active.png" mode="aspectFit"></image>
				</view>
				<view class="remarks">设备类别设备名称有故障，禁止使用！</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
    data(){
        return{
            popupShow:false
        }
    },
    methods:{
        close(){
            this.popupShow = false;
        }
    }
}
</script>

<style lang="scss" scoped>
	.cur-popup{
		width:654.17rpx;
		.close{
			width:76.39rpx;
			height:55.56rpx;
		}
		.content{
			padding: 0 40rpx 40rpx;
			box-sizing: border-box;
		}
		.title{
			font-weight:700;
			color:#333333;
			font-size:18px;
		}
		.title-icon{
			width:83.33rpx;
			height:83.33rpx;
		}
		.list-img{
			width:182.64rpx;
			height:182.64rpx;
			border-radius:5.56rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			&:nth-child(3n){
				margin-right: 0;
			}
		}
		.remarks{
			color:#666666;
			text-align: center;
			margin-top: 30rpx;
		}
	}
</style>
