<template>
  <el-row>
    <el-col :span="4">
      <SideBar v-bind:prop="sideBarData"/>
    </el-col>
    <el-col :span="20">
      <Header v-bind:prop="headerData" style="height: 70px;"/>
      <router-view ></router-view>
    </el-col>
  </el-row>
</template>  

<script>
import SideBar from './SideBar.vue'
import Header from './Header.vue'

const sidebarMeta = [
  {
    index: "1",
    title: "社团列表",
    icon: "my-icon-shetuan",
    route: "/home/associations"
  },
  {
    index: "2",
    title: "我的社团",
    icon: "my-icon-renyuan",
    route: "/home/myassociation"
  },
  {
    index: "3",
    title: "活动列表",
    icon: "my-icon-huodong",
    route: "/home/events"
  },
  {
    index: "4",
    title: "社团管理",
    icon: "my-icon-guanli",
    route: "/home/super"
  }
]

const superMeta = [
  {
    index: "1",
    title: "后台统计",
    icon: "el-icon-pie-chart",
    route: "/home/statistics"
  },
  {
    index: "2",
    title: "业务统计",
    icon: "el-icon-data-analysis",
    route: "/home/statisticsBusiness"
  },
  {
    index: "3",
    title: "业务管理",
    icon: "el-icon-tickets",
    route: "/home/businessmanagement"
  },
  {
    index: "4",
    title: "数据管理",
    icon: "el-icon-coin",
    route: "/home/database"
  }
]

export default {
  name: 'Home',
  components: {
    SideBar,
    Header
  },
  data() {
    return {
      sideBarData : {menuItems: 3, sidebarMeta: sidebarMeta, super: false, superMeta: superMeta},
      headerData : {name: null, unreadMsg: 0}
    }
  },
  created() {
    this.$axios.get('index/userInformation').then(res => {
      console.log(res.data);
      this.sideBarData.super = !res.data.user_role
      this.headerData.name = res.data.user_name
      this.headerData.unreadMsg = res.data.unread_message
    })
    console.log('home created');
    console.log(localStorage.getItem('token'))
  },
  mounted() {
    console.log('home mounted');
  },
  beforeDestroyed() {
    console.log('home destroyed');
  }
}
</script>