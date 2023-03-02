<template>
	<scroll-view scroll-y ref="scrollView" :style="{height: `calc(100vh - ${offsetTop})`}" :refresher-triggered="refresherTriggered"
	refresher-enabled show-scrollbar @scrolltolower="crolltolower" @refresherrefresh="refresherrefresh">
		<view style="overflow: hidden;">
			<slot></slot>
		</view>
	</scroll-view>
</template>
<script>
export default {
	props:{
		bottomHeight:{
			type:Number,
			default:50
		},
		refresherTriggered:{
			type:Boolean,
			default:false
		}
	},
	data(){
		return {
			offsetTop:0
		}
	},
    mounted(){
		this.offsetTop = this.$refs?.scrollView.$el.offsetTop + this.bottomHeight + 'px';
    },
	methods:{
		crolltolower(){
			this.$emit("crolltolower")
		},
		refresherrefresh(){
			this.$emit("refresherrefresh")
		}
	}
}
</script>