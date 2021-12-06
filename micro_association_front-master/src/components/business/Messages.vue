<template>
  <div>
    <div>
      <el-row>
        <el-col :span="12">
          <el-tabs type="card" v-model="activeName" style="height:38px">
            <el-tab-pane label="全部消息" name="allMsg"></el-tab-pane>
            <el-tab-pane label="未读消息" name="ureadMsg"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="text" style="margin-right:40px" @click="readAll">全部已读</el-button>
        </el-col>
      </el-row>
    </div>
    <div :style="{height: contentHeight, 'overflow-y':'auto'}">
      <el-card shadow="hover" v-for="(item, index) in tableData" :key="index" v-show="activeName === 'ureadMsg' ? !item.approver_read : true" style="border-radius: 5px">
        <el-row>
          <el-col :span="18" style="text-align:left">
            <span style="color:gray">{{timeFormat(index)}}</span>
            <span style="margin-left:40px">
              <el-button type="text" class="textbtn">{{frontBtn(index)}}</el-button>
              {{msgTemp(index)}}
              <el-button type="text" class="textbtn" style="margin:0">{{rearBtn(index)}}</el-button>
            </span>
          </el-col>
          <el-col :span="6" style="text-align:right">
            <el-button class="textbtn" v-if="item.message_type % 2 === 0 && !item.status" type="text" @click="confirm(index)">
              <i class="el-icon-check suc"></i>
            </el-button>
            <el-button class="textbtn" v-if="item.message_type % 2 === 0 && !item.status" type="text" @click="reject(index)">
              <i class="el-icon-close dan"></i>
            </el-button>
            <el-button class="textbtn" v-show="!item.approver_read" type="text" @click="read(index)" >
              <i class="el-icon-finished"></i>
            </el-button>
            <div v-show="item.message_type % 2 === 0 && item.status === 2" style="text-align:right; color: gray">已同意</div>
            <div v-show="item.message_type % 2 === 0 && item.status === 1" style="text-align:right; color: gray">已拒绝 </div>
          </el-col>
        </el-row>
      </el-card>
    </div>    
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
    name: 'Messages',
    data() {
      return {
        activeName: 'allMsg',
        tableData: null,
        contentHeight: document.body.clientHeight - 112 + 'px'
      }
    },
    created() {
      this.$axios.get('getMessageList').then(res=> {
        this.tableData = res.data.messages
      }).catch(err=>{console.log(err);})
    },
    mounted() {
      window.onresize = () => {
        this.contentHeight = document.body.clientHeight - 112 + 'px'
      }
    },
    methods:{
      timeFormat(index) {
        let t = new Date(this.tableData[index].message_time)
        return t.format('yyyy-MM-dd hh:mm')
      },
      frontBtn(index) {
        switch (this.tableData[index].message_type) {
          case 0: return this.tableData[index].applicator_name
          case 1: return ''
          case 2: return this.tableData[index].applicator_name
          case 3: return this.tableData[index].activity_name
          case 4: return this.tableData[index].applicator_name
          case 5: return ''
        }
      },
      msgTemp(index) {
        switch (this.tableData[index].message_type) {
          case 0: return '申请加入'
          case 1: return '恭喜你成功加入'
          case 2: return '申请活动'
          case 3: return '已审核通过'
          case 4: return '申请创建社团'
          case 5: return '恭喜你成功创建'
        }
      },
      rearBtn(index) {
        switch (this.tableData[index].message_type) {
          case 0: return this.tableData[index].association_name
          case 1: return this.tableData[index].association_name
          case 2: return this.tableData[index].activity_name
          case 3: return ''
          case 4: return this.tableData[index].association_name
          case 5: return this.tableData[index].association_name
        }
      },
      read(index) {
        if (!this.tableData[index].approver_read) {
          let t = new Date()
          this.tableData[index].approver_read = 1   
          this.$eventBus.$emit('readMsg')
          this.$axios.post('dealMessage', {
              message_id : this.tableData[index].message_id,
              status: 0,
              message_deal_time: t.getTime()
            }).then(res=>{
            if (!res.data.success) {
              console.log('fail to read msg, id = ' + this.tableData[index].message_id);
            }
          }).catch(err=>{console.log(err);})
        }
      },
      readAll(){
        for (var i = 0; i < this.tableData.length; ++i) {
          this.read(i)
        }
      },
      confirm(index) {
        let t = new Date()
        this.tableData[index].approver_read = 1   
        this.$eventBus.$emit('readMsg')
        this.tableData[index].status = 2
        this.$axios.post('dealMessage', {
            message_id : this.tableData[index].message_id,
            status: 2,
            message_deal_time: t.getTime()
          }).then(res=>{
          if (!res.data.success) {
            console.log('fail to confirm msg, id = ' + this.tableData[index].message_id);
          }
        }).catch(err=>{console.log(err);})   
      },
      reject(index) {
        let t = new Date()
        this.tableData[index].approver_read = 1   
        this.$eventBus.$emit('readMsg')
        this.tableData[index].status = 1
        this.$axios.post('dealMessage', {
            message_id : this.tableData[index].message_id,
            status: 1,
            message_deal_time: t.getTime()
          }).then(res=>{
          if (!res.data.success) {
            console.log('fail to confirm msg, id = ' + this.tableData[index].message_id);
          }
        }).catch(err=>{console.log(err);})        
      }    
    }
  }
</script>

<style>
  .suc{
    color:#67C23A;
  }
  .dan{
    color:#F56C6C;
  }
  .textbtn{
    padding:0px;
    border:0px;
  }
</style>