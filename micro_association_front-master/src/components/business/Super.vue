<template>
    <div>
        <!-- <el-button @click="put">put</el-button>
        <el-button @click="get">get</el-button>
        <el-button @click="reset">reset</el-button>
        <el-button @click="post">post</el-button>
        <div>time : {{lefttime}}</div>
        <div>csrf : {{csrf}}</div> -->
        <el-input v-model="src"></el-input>
        <div>{{encode}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            test:"<p>实时</p>",
            csrf:"",
            lefttime:10,
            src:""
        }
    },
    computed:{
        encode(src) {
            return this.$md5(this.src)
        }
    },
    methods:{
        put(){
            this.$axios.get('http://localhost:4000/put')
        },
        get(){
            this.$axios.get('http://localhost:4000/get').then(res => {
                console.log(res)
                this.csrf = res.data._anti_csrf
            })
        },
        reset(){
            this.$axios.get('http://localhost:4000/reset')
        },
        post(){
            this.$axios.post('http://localhost:4000/get',{}).then(res => {
                console.log(res)
                this.csrf = res.data._anti_csrf
            })
        },
        showTime() {
            if (this.lefttime != 0) {
                this.get()
                this.lefttime--;
            }
        }
    }
}
</script>