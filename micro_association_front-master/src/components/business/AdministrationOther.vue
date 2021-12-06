<template>
  <el-tabs v-model="userManage" type="card">
    <el-tab-pane label='用户管理' name='user'>
      <el-table
      :data='userTable'
      style='width:100%'>
      <el-table-column prop="student_id" label="学/工号" align="center">
      </el-table-column>
      <el-table-column prop="student_name" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="position_name" label="职位" align="center">
        <template slot-scope="{$index}">
        <el-select v-model="userTable[$index].position_name" @change="getStudentPosition($index,userTable[$index].student_id)">
          <el-option
            v-for="item in position_data"
            :key="item"
            :disabled='disabledd'
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </template>
      </el-table-column>
      </el-table>
    </el-tab-pane>

    <el-tab-pane label='权限管理' name='authority'>
      <el-table
      :data='authorityTable'
      style='width:100%'>
      <el-table-column prop="position_name" label="职位名称" align="center">
      </el-table-column>
      <el-table-column prop="position_level" label="职位等级" align="center">
        <template slot-scope="{$index}">
        <el-select v-model="authorityTable[$index].position_level"  @change="getAuthority($index,authorityTable[$index].position_level)">
          <el-option
            v-for="item in position_level_data"
            :key="item"
            :disabled='disabledd'
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        </template>
      </el-table-column>
      
      
      <el-table-column prop='ability_add'  label="通过申请"  align="center">
        <template slot-scope="{$index}">
          <el-checkbox v-model="authorityTable[$index].ability_add" @change="changeAdd($index)" disabled>
          <!-- <label for='checkbox'>{{ability_add[$index]}}</label> -->
          </el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop='ability_delete'  label="修改权限"  align="center">
        <template slot-scope="{$index}">
          <el-checkbox v-model="authorityTable[$index].ability_delete" @change="changeDelete($index)" disabled></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column prop='ability_event_application'  label="申请活动"  align="center">
        <template slot-scope="{$index}">
          <el-checkbox v-model="authorityTable[$index].ability_event_application" @change="changeEvent($index)" disabled></el-checkbox>
        </template>
      </el-table-column>
            
      </el-table>
    </el-tab-pane>
  </el-tabs>
  
</template>

<script>
export default {
  data() {
    return {
      userManage: 'user',
      authorityManage:'authority',
      disabledd:true,
      userOption:null,
      //获取到下拉框的绑定值
      //selectStudentPosition:[],
      //selectAuthority:[],
      student_id:null,
      student_name:null,
      position_name:null,
      position_level:null,
      ability_add:false,
      ability_delete:true,
      ability_event_application:null,
      position_data: [
        '社长',
        '副社长',
        '部长',
        '部委',
        '成员'
      ],
      position_level_data: [
        '1','2','3','4','5',
        '6','7','8','9','10',
      ],
      userTable:[],
      authorityTable:[],
    }
  },
  methods:{
    //modify user manage  num=index  id=student_id
    getStudentPosition(num, id){
      this.$axios.post('changeStudent',{
        association_id:parseInt(this.$route.params.id),
        student_id:id,
        position_name:this.$data.userTable[num].position_name
      }).then(res=>{
        console.log(res.data)
        console.log('position_name')
        console.log(this.$data.userTable[num].position_name)
      }).catch(err=>{console.log(err);})
        // console.log(this.$route.params.id)
    },

    //modify authority 
    getAuthority(num, id){
      this.$axios.post('changePositionLevel',{
        association_id:parseInt(this.$route.params.id),
        position_name:this.$data.authorityTable[num].position_name,
        position_level:parseInt(this.$data.authorityTable[num].position_level)
      }).then(res=>{
        console.log(parseInt(this.$route.params.id)),
        console.log(parseInt(this.$data.authorityTable[num].position_level))
      }).catch(err=>{console.log(err);})
    },


    changeAdd(num){
      this.$axios.post('changeAbilityAdd',{
        association_id:parseInt(this.$route.params.id),
        position_name:this.$data.authorityTable[num].position_name,
        ability_add:Boolean(this.$data.authorityTable[num].ability_add),  //choose ability_add, ability_delete or others
      }).then(res=>{
        console.log(res.data)
        console.log("position_name:")
        console.log(this.$data.authorityTable[num].position_name)
        console.log("ability_add:")
        console.log(Boolean(this.$data.authorityTable[num].ability_add))
      }).catch(err=>{console.log(err);})
    },

    changeDelete(num){
      this.$axios.post('changeAbilityDelete',{
        association_id:parseInt(this.$route.params.id),
        position_name:this.$data.authorityTable[num].position_name,
        ability_delete:Boolean(this.$data.authorityTable[num].ability_delete),  //choose ability_add, ability_delete or others
        //status:this.$data.authorityTable[num].ability_choose
      }).then(res=>{
        console.log(res.data)
      }).catch(err=>{console.log(err);})
      //console.log(this.$route.params.id),
      //console.log(this.$data.authorityTable[num].position_name),
      //console.log(this.$data.ability_delete[num])
    },

    changeEvent(num){
      this.$axios.post('changeEventApplication',{
        association_id:parseInt(this.$route.params.id),
        position_name:this.$data.authorityTable[num].position_name,
        ability_event_application:Boolean(this.$data.authorityTable[num].ability_event_application),  //choose ability_add, ability_delete or others
        //status:this.$data.authorityTable[num].ability_choose
      }).then(res=>{
        console.log(res.data)
      }).catch(err=>{console.log(err);})

    }
  },
  created() {
    //user manage
    this.$axios.post('userManage',{
      association_id: parseInt(this.$route.params.id),
      }).then(res=> {
        this.$data.disabled=res.data.ability_authority_modification
        this.userTable = res.data.authority_members
        console.log("userTable")
        console.log(this.userTable)
       }).catch(err=>{console.log(err);})  


    //authority manage 
    this.$axios.post('authorityManage',{
        association_id: parseInt(this.$route.params.id)
      }).then(res=> {
         this.authorityTable = res.data.authorities
         console.log('authorities')
         console.log(res.data.authorities)
       }).catch(err=>{console.log(err);})

      // 可以从数据库获取职位们
      // this.$axios.get('getStudentPosition').then(res => {
      //   this.position_data = res.data.position_data
      //   }).catch(err => {this.$message.error(err)}) 
  },
  mounted(){
      var val = this.$route.params.id;
  },
  computed:{
  }
}

</script>