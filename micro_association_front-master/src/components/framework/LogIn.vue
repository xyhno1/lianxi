<template>
    <div> 
      <div class="background"></div>
      <div :style="{'padding-top':(bodyHeight - 400) / 2 + 'px'}">
        <el-card style="width: 380px; height: 400px; margin: auto;border-radius: 20px">
          <h1 style="margin-top:20px">统一认证系统</h1>
            <el-form ref="form" :model="userInfo" :rules="rules">
              <el-form-item label="学号/工号：" prop="username">
                <el-input v-model="userInfo.username"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="password" @keyup.enter.native="onSubmit">
                <el-input v-model="userInfo.password" show-password></el-input>
              </el-form-item>  
              <el-form-item>   
                <el-button type="primary" round @click="onSubmit">登录</el-button> 
              </el-form-item>        
            </el-form>              
        </el-card>
      </div>
    </div>
</template>

<script>
  let baseUrl = 'http://152.136.97.240'
  let basePort = '60000'
  let localUrl = 'http://localhost'
  export default {
    name: 'LogIn',
    data() {
      return {
        bodyHeight: document.body.clientHeight,
        whiteList:[
          baseUrl,
          localUrl
        ],
        userInfo: {
          username: "",
          password: ""
        }, 
        rules: {
          username: [
            { required: true, message: '请输入学号/工号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{  
      checkUrl(url) {
        for (let trust of this.whiteList) {
          if (url.search(trust) != -1) {
            return true
          }
        }    
        return false    
      },
      onSubmit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$axios.post('sso/login', {username: this.userInfo.username, password: this.$md5(this.userInfo.password)}).then(res=>{
              console.log(res)
              if (res.data.success) {
                localStorage.setItem("token", res.data.token)
                let redirect = decodeURIComponent(this.$route.query.redirect || '');
                if (this.checkUrl(redirect)) {
                  window.location.href = redirect
                }
                else {
                  if (location.hostname === '152.136.97.240'){
                    window.location.href = baseUrl + ':' + basePort + '/#/home'
                  }
                  else {
                    window.location.href = localUrl + ':8080' + '/#/home'
                  }
                }
              }
              else {
                this.$message.error(res.data.errorMessage)
                this.$refs['form'].resetFields()
              }        
              
            }).catch(err=>{
              console.log(err)
            }) 
          }
          else {
            return false
          }
        }) 
      }
    },
    mounted() {
      window.onresize = () => {
        this.bodyHeight =  document.body.clientHeight
      }
    }
  }
</script>

<style scoped>
  .background{
    position:fixed;
    top: 0;
    left: 0;
    width:100%;  
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    min-width: 1000px;
    zoom: 1;
    background-color: #fff;
    background: url(../../assets/images/loginBackground.jpg) no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
</style>