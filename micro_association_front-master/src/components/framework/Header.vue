<template>
  <el-row type="flex" align="middle">
    <el-col :span="12">
      <div style="text-align: left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{showBreadcrumb}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-col>
    <el-col :span="12" style="text-align: right;">
      <el-button type="text" @click="checkMsg">        
        <el-badge :value="prop.unreadMsg" :hidden="prop.unreadMsg <= 0">
          <i class="el-icon-bell" style="font-size:22px"/>
        </el-badge>    
      </el-button>
      <el-popover placement="bottom-start">
        <div style="width:200px;text-align:center">
          <el-avatar icon="my-icon-avatar"></el-avatar>
          <div class="nick">{{prop.name}}</div>
          <el-button size="mini" type="danger" @click="logOut" round plain>登出</el-button>
        </div>
        <el-button type="text" style="margin-left: 20px;margin-right: 40px" class="vtk" slot="reference">
            <i class="my-icon-avatar" style="font-size:20px"/>
        </el-button>      
      </el-popover>          
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props:["prop"],
    data() {
      return {
        breadcrumb: {
          // '/home': '首页',
          '/home/associations': '社团列表',
          '/home/myassociation': '我的社团',
          '/home/events': '活动列表',
          '/home/statistics': '后台统计',
          '/home/statisticsBusiness': '业务统计',
          '/home/businessmanagement': '业务管理',
          '/home/database': '数据管理',
          '/home/messages': '消息',
        }
      }      
    },
    computed: {
      showBreadcrumb() {
        return this.breadcrumb[this.$route.fullPath]
      }
    },
    created() {
      this.$eventBus.$on('readMsg', ()=>{
        --this.prop.unreadMsg
      })
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logOut() {
        this.$axios.post('sso/logout', {}).then(res => {
          if (res.data.success) {
            localStorage.removeItem('token')//清除token
            this.$router.push('/login')
          }
          else {
            this.$message.error(res.data.errorMessage)
          }
        }).catch(err =>{console.log(err)})
      },
      checkMsg() {
        this.$router.push('/home/messages') 
      }
    }
  };
</script>

<style scoped>
  .vtk {
    display: inline-block;
    vertical-align: middle;
  }
  .nick {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    color: #000;
    margin-bottom:25px;
  }

</style>