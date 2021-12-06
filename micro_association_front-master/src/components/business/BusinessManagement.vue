<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="用户管理" name="user">
      <el-table
        :data="users"
        style="width: 100%" :height="bodyHeight - 70 - 56">
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="{row}">
            <el-button
              class="textbtn"
              type="text"
              @click="deleteUser(row.user_id)"
            >
              <i class="el-icon-delete dan"></i>
            </el-button>     
          </template>
        </el-table-column>    
        <el-table-column width="48" align="center">
          <template slot="header">
            <el-tooltip effect="dark" content="添加用户" placement="top">
              <el-button
                class="textbtn"
                type="text"
                @click="addUserVisible=true"
              >
                <i class="el-icon-plus"></i>
              </el-button>     
            </el-tooltip>
          </template>          
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="学/工号">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="user_roleName"
          label="类型">
          <template slot-scope="{row}">
            <el-tag type="success">{{row.user_roleName}}</el-tag>
          </template>          
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        center
        @open="openAddUser">            
        <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="80px">
          <el-form-item label="学/工号" prop="user_id">
            <el-input v-model="userForm.user_id"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="user_name">
            <el-input v-model="userForm.user_name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="user_password">
            <el-input v-model="userForm.user_password"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="user_role">
            <el-select v-model="userForm.user_role" placeholder="请选择">
              <el-option
                v-for="(item, index) in roles"
                :key="index"
                :label="item.role_name"
                :value="item.role_id">
              </el-option>
            </el-select>     
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="applyAddUser">确 定</el-button>
          <el-button @click="resetForm('userForm')">重 置</el-button>
        </span>
      </el-dialog>      
    </el-tab-pane>
    <el-tab-pane label="活动管理" name="activity">
      <el-table
        :data="activitys"
        style="width: 100%" :height="bodyHeight - 70 - 56">
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="{row}">
            <el-button
              class="textbtn"
              type="text"
              @click="deleteActivity(row.activity_id)"
            >
              <i class="el-icon-delete dan"></i>
            </el-button>     
          </template>
        </el-table-column>    
        <el-table-column type="expand">
          <template slot="header">
            <el-tooltip effect="dark" content="添加活动" placement="top">
              <el-button
                class="textbtn"
                type="text"
                @click="addActivityVisible=true"
              >
                <i class="el-icon-plus"></i>
              </el-button>     
            </el-tooltip>
          </template>          
          <template slot-scope="props">
            <p>{{ props.row.activity_desc }}</p>
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
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="activity_end"
          label="结束时间">
        </el-table-column>
      </el-table>
      <el-dialog
        title="发起活动"
        :visible.sync="addActivityVisible"
        center @open="openAddActivity">            
        <el-form ref="activityForm" :model="activityForm" :rules="activityRules" label-width="100px">
          <el-form-item label="活动名称" prop="activity_name">
            <el-input v-model="activityForm.activity_name"></el-input>
          </el-form-item>
          <el-form-item label="举办方" prop="activity_founder_idx">
            <el-select v-model="activityForm.activity_founder_idx" placeholder="请选择举办方">
              <el-option v-for="(item, index) in founders" :key="index" :label="item.association_name" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" prop="timeRange">
            <el-date-picker
              v-model="activityForm.timeRange"
              type="datetimerange"
              @change="getAvaliableClassroom"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="人员上限" prop="activity_capacity">
            <el-input-number v-model="activityForm.activity_capacity" :min="0" @change="getAvaliableClassroom" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="借用教室" prop="useClassroom">
            <el-switch v-model="activityForm.useClassroom"></el-switch>
          </el-form-item >     
          <el-form-item label="活动地点" prop="activity_place" v-show="!activityForm.useClassroom">
            <el-input v-model="activityForm.activity_place"></el-input>
          </el-form-item>  
            <el-form-item v-show="activityForm.useClassroom" label="选择教室" prop="activity_id">
              <el-select v-model="activityForm.classroom_index" placeholder="选择空闲教室">
                <el-option v-for="(item, index) in avaliableClassrooms" :key="index" :label="item.classroom_name" :value="index"></el-option>
              </el-select>
            </el-form-item>   
          <el-form-item label="活动描述" prop="activity_desc">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="activityForm.activity_desc">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="applyAddActivity">确 定</el-button>
          <el-button @click="resetForm('activityForm')">重 置</el-button>
        </span>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="教室管理" name="classroom">
      <el-table
        :data="classrooms"
        style="width: 100%" :height="bodyHeight - 70 - 56">
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="{row}">
            <el-button
              class="textbtn"
              type="text"
              @click="deleteClassroom(row.classroom_id)"
            >
              <i class="el-icon-delete dan"></i>
            </el-button>     
          </template>
        </el-table-column>    
        <el-table-column width="48" align="center">
          <template slot="header">
            <el-tooltip effect="dark" content="添加教室" placement="top">
              <el-button
                class="textbtn"
                type="text"
                @click="addClassroomVisible=true"
              >
                <i class="el-icon-plus"></i>
              </el-button>     
            </el-tooltip>
          </template>          
        </el-table-column>
        <el-table-column
          prop="classroom_name"
          label="教室名称">
        </el-table-column>
        <el-table-column
          prop="classroom_capacity"
          label="容量">
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加教室"
        :visible.sync="addClassroomVisible"
        center>            
        <el-form ref="classroomForm" :model="classroomForm" :rules="classroomRules" label-width="100px">
          <el-form-item label="教室名称" prop="classroom_name">
            <el-input v-model="classroomForm.classroom_name"></el-input>
          </el-form-item>
          <el-form-item label="人员上限" prop="classroom_capacity">
            <el-input-number v-model="classroomForm.classroom_capacity" :min="0" :controls="false"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="applyAddClassroom">确 定</el-button>
          <el-button @click="resetForm('classroomForm')">重 置</el-button>
        </span>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return{
        activeName: 'user',
        bodyHeight: document.body.clientHeight,
        activitys: [],
        classrooms:[],
        users:[],
        addActivityVisible: false,
        addClassroomVisible: false,
        addUserVisible: false,        
        activityForm:{
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
        classroomForm:{
          classroom_name:null, 
          classroom_capacity: 0
        },
        userForm:{
          user_id: null,
          user_name: null,
          user_password: null,
          user_role: null          
        },
        activityRules: {
          activity_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          activity_founder_idx: [
            { required: true, message: '请选择举办方', trigger: 'change' }
          ],
          timeRange: [
            { required: true, message: '请选择起止时间', trigger: 'change' }
          ]
        },
        classroomRules: {
          classroom_name: [
            { required: true, message: '请输入教室名称', trigger: 'blur' }
          ]
        },
        userRules: {
          user_id: [
            { required: true, message: '请输入学/工号', trigger: 'blur' }
          ],
          user_name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          user_password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          user_role: [
            { required: true, message: '请输入类型', trigger: 'change' }
          ],
        },
        founders:[],
        avaliableClassrooms:[],
        roles:[]
      }
    },
    methods:{
      openAddActivity() {
        this.$axios.get('getFounders').then(res=>{
          this.founders = res.data.founders
        })
      },
      openAddUser() {
        this.$axios.get('user/roleList').then(res=>{
          this.roles = res.data.roles
        })
      },
      getActivity() {
        this.$axios.get('home/activityListAll').then(res=>{
          this.activitys = res.data.activities

          for (var i = 0; i < res.data.activities.length; ++i) {
            let start = new Date(res.data.activities[i].activity_start)
            let end = new Date(res.data.activities[i].activity_end)

            this.activitys[i].activity_start = start.format('yyyy-MM-dd hh:mm')
            this.activitys[i].activity_end = end.format('yyyy-MM-dd hh:mm')
          }
        }).catch(err=>{console.log(err);})
      },
      getClassroom() {
        this.$axios.get('classroom/classroomListAll').then(res=>{
          this.classrooms = res.data.classRooms
        }).catch(err=>{console.log(err)})
      },
      getUser() {
        this.$axios.get('user/userList').then(res=>{
          this.users = res.data.users
        }).catch(err=>{console.log(err)})
      },
      applyAddActivity() {
        this.$refs['activityForm'].validate(valid => {
          if (valid) {
            this.$axios.post('activity/addActivity', {
              activity_name: this.activityForm.activity_name,
              activity_desc: this.activityForm.activity_desc,
              activity_founder_id: this.founders[this.activityForm.activity_founder_idx].association_id,
              activity_founder: this.founders[this.activityForm.activity_founder_idx].association_name,
              activity_start: this.activityForm.timeRange[0].getTime(),
              activity_end: this.activityForm.timeRange[1].getTime(),
              classroom_id: this.activityForm.useClassroom ? this.avaliableClassrooms[this.activityForm.classroom_index].classroom_id : 0,
              activity_place: this.activityForm.useClassroom ? this.avaliableClassrooms[this.activityForm.classroom_index].classroom_name : this.activityForm.activity_place,
              activity_capacity: this.activityForm.activity_capacity
            }).then(res=>{
              if (res.data.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })        
                this.getActivity()    
              }
              else {
                this.$message.error(res.data.errMessage)            
              }
            }).catch(err=>{console.log(err)})
            this.addActivityVisible = false            
          }
          else {
            return false
          }
        })
      },
      applyAddClassroom() {
        this.$refs['classroomForm'].validate(valid => {
          if (valid) {
            this.$axios.post('classroom/addClassroom', this.classroomForm).then(res=>{
              if (res.data.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })       
                this.getClassroom()     
              }
              else {
                this.$message.error(res.data.errMessage)            
              }
            }).catch(err=>{console.log(err)})
            this.addClassroomVisible = false            
          }
          else {
            return false
          }
        })
      },
      applyAddUser() {
        this.$refs['userForm'].validate(valid => {
          if (valid) {
            this.$axios.post('user/add_user', this.userForm).then(res=>{
              if (res.data.success) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })       
                this.getUser()     
              }
              else {
                this.$message.error(res.data.err_message)            
              }
            }).catch(err=>{console.log(err)})
            this.addUserVisible = false            
          }
          else {
            return false
          }
        })
      },
      deleteActivity(id) {
        this.$axios.post('activity/deleteActivity', {activity_id: id}).then(res => {
          if (res.data.success) {
            this.getActivity()
          }
          else {
            this.$message.error(res.data.errMessage)
          }
        })
      },
      deleteClassroom(id) {
        this.$axios.post('classroom/deleteClassroom', {classroom_id: id}).then(res => {
          if (res.data.success) {
            this.getClassroom()
          }
          else {
            this.$message.error(res.data.errMessage)
          }
        })
      },
      deleteUser(id) {
        this.$axios.post('user/delete_user', {user_id: id}).then(res => {
          if (res.data.success) {
            this.getUser()
          }
          else {
            this.$message.error(res.data.err_message)
          }
        })
      },
      getAvaliableClassroom() {
        if (!this.activityForm.timeRange.length || !this.activityForm.timeRange[0]) return
        this.$axios.post('classroom/empty_classroom', {
          occupy_start: this.activityForm.timeRange[0].getTime(),
          occupy_end: this.activityForm.timeRange[1].getTime(), 
          classroom_capacity: this.activityForm.activity_capacity
          }).then(res=>{
          this.activityForm.classroom_index = null
          this.avaliableClassrooms = res.data.rooms
        }).catch(err=>{console.log(err)})        
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }     
    },
    created() {
      this.getActivity()
      this.getClassroom()
      this.getUser()
    },
    mounted() {
      window.onresize = () => {
        this.bodyHeight =  document.body.clientHeight
      }
    }
}

</script>

<style>
  .smallpop {
    min-width: 0px;
    padding:6px;
  }
</style>