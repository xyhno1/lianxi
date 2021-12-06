<template>
  <div>
 <el-table
    
    :data="item"
    style="width: 100%">
   
    <el-table-column prop="association_name" label="社团名称"  align="center"> </el-table-column>
    <el-table-column prop="association_founder" label="社长" width="240" align="center"> </el-table-column>  
    <el-table-column prop='association_count' label="社团人数"  align="center"> </el-table-column>
    <el-table-column prop='association_intro' label="社团简介"  align="center"> 
      <template slot-scope="{$index}">
        <el-button type="text" @click="open1($index)"> {{item[$index].association_name}}简介 </el-button>
      </template>
    </el-table-column>
    <el-table-column prop='student_position' label="我的职位"  align="center"> </el-table-column>
    <el-table-column  label="权限"  align="center">
      <template slot-scope="{$index}">
        <el-button v-if="showButton($index)" type="primary" plain @click="changego(item[$index].association_id,item[$index].student_position)" >社团管理</el-button>
      </template>
    </el-table-column>
  </el-table>
  
</div>
</template>


<script>
export default {
  data() {
    return{
      association_id:1,
      association_name: null,
      association_founder:null,
      association_count:1,
      association_intro: null,
      student_position:null,
      item:[],
    }
  },
  created() {
       this.$axios.get('getMyAssociation').then(res=> {
         this.item = res.data.my_associations
         
       }).catch(err=>{console.log(err);})
    },
  methods: {
    showButton(num){
      if(this.$data.item[num].student_position == "成员" ){
        return false
      }
      return true   //这里如果只有社长有权限的话更改为false
    },

    //动态路由跳转
    changego(num,student_position){
      //this.$router.replace("/home/administration")
      // 返回到上一级 this.$router.go(-1)
      // 可以指定跳转到某一个页面
      if(student_position == "社长" ){
        this.$router.push({path:"/home/administration/"+num})
      }
      else{
        this.$router.push({path:"/home/administrationOther/"+num})
      }
    },
    //弹出消息提示
    open1(num) {
      this.$alert(this.$data.item[num].association_intro, this.$data.item[num].association_name,{
        confirmButtonText:"确定",
      })

    },
    open2() {
      this.$message({
        message: '申请成功，等待审核',
        type: 'success'
      });
    },
    open3() {
      this.$message({
        message: '警告，这是一条警告消息',
        type: 'warning'
      });
    },
    open4() {
      this.$message.error('错了，这是一条错误消息');
    }
  }
}

</script>
