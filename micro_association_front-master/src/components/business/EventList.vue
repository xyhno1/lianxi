<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%" 
      :height="bodyHeight - 70"
      :default-sort = "{prop: 'activity_start', order: 'descending'}">
      <el-table-column type="expand">
        <template slot="header">
          <el-tooltip effect="dark" content="发起活动" placement="top">
            <el-button
              class="textbtn"
              type="text"
              @click="centerDialogVisible=true"
            >
              <i class="el-icon-plus"></i>
            </el-button>     
          </el-tooltip>
        </template>          
        <template slot-scope="props">
          <el-row>
            <el-col :span="20">{{ props.row.activity_desc }}</el-col>
            <el-col :span="4" style="text-align:right"><el-button size="mini" @click="participate">申请加入</el-button></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="activity_name"
        label="活动名称">
      </el-table-column>
      <el-table-column
        prop="activity_founder"
        label="举办方">
      </el-table-column>
      <el-table-column
        prop="activity_place"
        label="场地">
      </el-table-column>
      <el-table-column
        prop="activity_capacity"
        label="场地容量">
      </el-table-column>
      <el-table-column
        prop="activity_start"
        label="开始时间"
        sortable>
      </el-table-column>
      <el-table-column
        prop="activity_end"
        label="结束时间"
        sortable>
      </el-table-column>
    </el-table>
    <el-dialog
      title="发起活动"
      :visible.sync="centerDialogVisible"
      center @open="openDialog">            
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="活动名称" prop="activity_name">
          <el-input v-model="form.activity_name"></el-input>
        </el-form-item>
        <el-form-item label="举办方" prop="activity_founder_idx">
          <el-select v-model="form.activity_founder_idx" placeholder="请选择举办方">
            <el-option v-for="(item, index) in founders" :key="index" :label="item.association_name" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            @change="getClassroom"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="人员上限" prop="activity_capacity">
          <el-input-number v-model="form.activity_capacity" :min="0" @change="getClassroom" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="借用教室" prop="useClassroom">
          <el-switch v-model="form.useClassroom"></el-switch>
        </el-form-item >     
        <el-form-item label="活动地点" prop="activity_place" v-show="!form.useClassroom">
          <el-input v-model="form.activity_place"></el-input>
        </el-form-item>  
          <el-form-item v-show="form.useClassroom" label="选择教室" prop="activity_id">
            <el-select v-model="form.classroom_index" placeholder="选择空闲教室">
              <el-option v-for="(item, index) in classrooms" :key="index" :label="item.classroom_name" :value="index"></el-option>
            </el-select>
          </el-form-item>   
        <el-form-item label="活动描述" prop="activity_desc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.activity_desc">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="apply">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  Date.prototype.format = function(fmt){
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };

    if(/(y+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
          
    for(var k in o){
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(
          RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
      }       
    }

    return fmt;
  }

  export default {
    name: 'EventList',
    data() {    
      return {
        tableData: [{
          activity_name:'暂无活动', 
          activity_founder:'无', 
          activity_desc:'无', 
          activity_place:'无', 
          activity_start: "", 
          activity_end: "",
          activity_capacity: 0,
          activity_id: 0
        }],
        centerDialogVisible: false,
        now: 0,
        bodyHeight: document.body.clientHeight,
        founders:[],
        classrooms:[],
        form:{
          activity_name:null, 
          activity_founder_idx:null, 
          activity_desc:null, 
          useClassroom: false,
          classroom_index: null,
          activity_place:null, 
          timeRange:[],
          activity_start: null, 
          activity_end: null,
          activity_capacity: 0
        },
        rules: {
          activity_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          activity_founder_idx: [
            { required: true, message: '请选择举办方', trigger: 'change' }
          ],
          timeRange: [
            { required: true, message: '请选择起止时间', trigger: 'change' }
          ]
        }
      }
    },
    methods:{
      openDialog() {
        this.$axios.get('getFounders').then(res=>{
          console.log(res);
          this.founders = res.data.founders
        })
      },
      getClassroom() {
        if (!this.form.timeRange.length || !this.form.timeRange[0]) return
        this.$axios.post('classroom/empty_classroom', {
          occupy_start: this.form.timeRange[0].getTime(),
          occupy_end: this.form.timeRange[1].getTime(), 
          classroom_capacity: this.form.activity_capacity
          }).then(res=>{
          this.form.classroom_index = null
          this.classrooms = res.data.rooms
        }).catch(err=>{console.log(err)})
      },
      apply() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$axios.post('activity/addActivity', {
              activity_name: this.form.activity_name,
              activity_desc: this.form.activity_desc,
              activity_founder_id: this.founders[this.form.activity_founder_idx].association_id,
              activity_founder: this.founders[this.form.activity_founder_idx].association_name,
              activity_start: this.form.timeRange[0].getTime(),
              activity_end: this.form.timeRange[1].getTime(),
              classroom_id: this.form.useClassroom ? this.classrooms[this.form.classroom_index].classroom_id : null,
              activity_place: this.form.useClassroom ? this.classrooms[this.form.classroom_index].classroom_name : this.form.activity_place,
              activity_capacity: this.form.activity_capacity
            }).then(res=>{
              if (res.data.success) {
                this.$message({
                  message: '申请成功',
                  type: 'success'
                })            
              }
              else {
                this.$message.error('申请失败，网络开小差了')            
              }
            }).catch(err=>{console.log(err)})
            this.centerDialogVisible = false            
          }
          else {
            return false
          }
        })
      },
      participate() {
        this.$message({
          message: '申请成功',
          type: 'success'
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      this.$axios.get('home/activityListAll').then(res=>{
        this.tableData = res.data.activities

        for (var i = 0; i < res.data.activities.length; ++i) {
          let start = new Date(res.data.activities[i].activity_start)
          let end = new Date(res.data.activities[i].activity_end)

          this.tableData[i].activity_start = start.format('yyyy-MM-dd hh:mm')
          this.tableData[i].activity_end = end.format('yyyy-MM-dd hh:mm')
        }
      }).catch(err=>{console.log(err);})
    },
    mounted() {
      window.onresize = () => {
        this.bodyHeight =  document.body.clientHeight
      }
    }
  };
</script>

<style scoped>
  .tl {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    color: #000;
    margin-bottom:10px;    
  }
  .vtk {
    display: inline-block;
    vertical-align: middle;
  }
</style>