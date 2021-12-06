<template>
  <div>
    <el-image
      :src="url"
      fit="fill">
    </el-image>
    <el-menu default-active="/home/associations" class="el-menu-vertical-demo" router>
      <el-menu-item v-for="index in prop.menuItems" :key="index" :index="prop.sidebarMeta[index - 1].route">
        <template slot="title">
          <i :class="prop.sidebarMeta[index-1].icon" style="font-size:22px"></i>
          <span slot="title" style="margin-left:1em">{{prop.sidebarMeta[index-1].title}}</span>
        </template>
      </el-menu-item>
      <el-submenu v-if="prop.super" :index="(prop.menuItems+1).toString()">
        <template slot="title">
          <i class="my-icon-houtai" style="font-size:22px"></i>
          <span slot="title" style="margin-left:1em">后台管理</span>
        </template>       
        <el-menu-item v-for="(item, index) in prop.superMeta" :key="index" :index="item.route" style="padding-right:10px;height:40px;line-height:40px">
          <template slot="title">
            <i :class="item.icon" style="font-size:20px"></i>
            <span slot="title" style="margin-left:1em">{{item.title}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
  el-menu-item {
    height:46px;
    line-height: 46px;
  }
</style>

<script>
  export default {
    props: ["prop"],
    data() {
      return {
        url: require('../../assets/images/logo.png')
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>