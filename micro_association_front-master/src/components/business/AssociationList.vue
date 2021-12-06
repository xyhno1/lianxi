<template>
  <div>
 <el-table
    :data="item"
    height="750"
    style="width: 100%">
   
    <el-table-column prop="association_name" label="社团名称"  align="center"> </el-table-column>
    <el-table-column prop="association_founder" label="社长" width="240" align="center"> </el-table-column>  
    <el-table-column prop='association_count' label="社团人数"  align="center"> </el-table-column>
    <el-table-column prop='association_intro' label="社团简介"  align="center"> 
      <template slot-scope="{$index}">
        <el-button type="text" @click="open1($index)"> {{item[$index].association_name}}简介 </el-button>
      </template>
    </el-table-column>
    <el-table-column prop='status' label="状态"  align="center"> 
      <template slot-scope="{$index}">
        <el-button v-if="item[$index].status==0" type="primary" plain @click="open2($index,item[$index].association_id)" >申请加入</el-button>
        <el-button v-if="item[$index].status==1" type="info" plain @click="open3" >等待审核</el-button>
        <el-button v-if="item[$index].status==2" type="success" plain @click="open4" >审核通过</el-button>
      </template>  
    </el-table-column>
  </el-table>

</div>
</template>

<script>
import { Field, MessageBox, Toast } from 'mint-ui';
//import func from '../../../vue-temp/vue-editor-bridge';
  export default {
  data() {
    return{
      isDisabled:false,
      association_id:1,
      association_name: null,
      association_founder:null,
      association_intro:null,
      association_count:1,
      status:0,
      item:[],
    }
  },
  created() {
       this.$axios.get('getAssociationList').then(res=> {
         this.item = res.data.associations
         //console.log(res.data.associations)
       }).catch(err=>{console.log(err);})
  },
  methods: {
    //无限滚动
    load () {
        this.count += 2
    },
    //弹出消息提示
    open1(num) {
      this.$alert(this.$data.item[num].association_intro, this.$data.item[num].association_name,{
        confirmButtonText:"确定",
      })
    },

    //num----association_id
    open2(num,id) {
      this.$axios.post('applyAssociation',{
        association_id:id,
        apply_time:Date.now()
        }    
      ).then(res=>{
        console.log(res.data)
          if(res.data){
            this.$data.item[num].status=1
            this.$alert("您的社团申请正在审核中...","提示",{
              confirmButtonText:"确定",
            })
            //location.reload() 刷新整个页面，会有短暂空白
          }
          else{
            this.$message.error('申请失败，网络开小差了')    
          }
        }
      )
      //console.log(id)
      //console.log(this.$data.item[num])
      },
    open3() {
      this.$message({
        message: '您的社团申请正在审核中',
        type: 'warning'
      });
    },
    open4() {this.$message({
        message: '您的社团申请已审核通过',
        type: 'success'
      });
    },
  },
  computed:{
    // checkDisabled(){
    //   return this.isDisabled
    // }
  }
}

</script>