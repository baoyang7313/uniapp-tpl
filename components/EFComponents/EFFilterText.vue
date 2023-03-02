<template>
	<view style="width: 100%;">
		<view class="flex1" @click="filterTextHandler(child)">
			<u--input :value="getCodeToName(value,child)" border="none" placeholder="请搜索"
				disabled disabledColor="#fff">
			</u--input>
			<u-icon v-if="!disabled" class="right-icon" v-slot="right" name="search"
				color="#bcc1c9" size="28"></u-icon>
		</view>
        <!-- 弹出层 -->
		<u-popup :show="popupShow">
			<view class="model">
				<custom-nav-bar title="搜索设备" :isGoToBack="false" @goBack="removePush"></custom-nav-bar>
				<view>
					<view class="padding" v-if="child.serachKey">
						<u-search borderColor="#12b19e" placeholder="搜索设备" shape="square" :showAction="false" v-model="form[child.serachKey]" @search="init" @clear="init"></u-search>
					</view>
					<u-cell-group :border="false">
						<u-cell @click="itemHanlder(item)" :title="item[child.label]" v-for="(item,index) in child.resList || []" :key="index"></u-cell>
					</u-cell-group>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
    props:{
        value:{
            type:String,
            default:""
        },
        disabled:{
            type:Boolean,
            default:false
        },
        child:{
            type:Object,
            default:()=>{
                return {}
            }
        }
    },
    data(){
        return {
            // 弹出层是否弹出
            popupShow:false,
            form:{
                
            }
        }
    },
    mounted() {
        this.init();
        if (window.history && window.history.pushState) {
		    window.addEventListener('popstate', this.fun, false);//false阻止默认事件
        }
    },
    destroyed(){
        // 返回路径
        window.removeEventListener('popstate', this.fun, false);//false阻止默认事件
    },
    methods:{
        fun(){
            this.popupShow = false;
        },
        init(){
            this.$http(this.child.dickUrl,this.form,{method:'get'}).then(res=>{
                const rows = res.rows || res.data || [];
                this.child.resList = rows;
                this.$forceUpdate()
            })
        },
        filterTextHandler(){
            if (this.disabled) return;
            this.addPush();
        },
        itemHanlder(item){
            this.$emit("input",item[this.child.id])
            this.$emit("change",item);
            this.removePush();
        },
        getCodeToName(value, item) {
            if (!value) return value;
            if (!item.resList) return value;
            const item2 = item.resList.find(o => o[item.id || 'id'] == value);
            if(!item2) return value;
            return item2[item.label || 'label'];
        },
        addPush(){
            this.popupShow = true;
            // 添加空白页面
            history.pushState(null, null, location.href);
        },
        removePush(){
            this.popupShow = false;
            // 销毁记录
            window.history.back() 
        }
    }
}
</script>
<style lang="scss" scoped>
	.right-icon {
		margin-right: 7px;
	}
	.model{
		width: 100%;
		height: 100vh;
		background-color: #fff;
	}
</style>