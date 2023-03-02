<template>
	<span>{{ myvalue }}</span>
</template>

<script>
import dict from "@/config/dict";
export default {
    name: "ef-status",
    props: {
        type: {
            type: String,
            default: ""
        },
        value: {
            type: [String, Number],
            default: ""
        }
    },
    data() {
        return {
            myvalue:""
        };
    },
    watch:{
        value:{
            handler(){
                this.getData();
            },
            immediate:true
        }
    },
    mounted() {
        
    },
    methods:{
        getData(){
            const dictArr = dict[this.type];
            const item = dictArr.find((o) => o.value == this.value);
            if (item) {
			    this.myvalue = item.label;
            }
        }
    }
}
</script>