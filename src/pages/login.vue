<template>
<div class="login_box">
    <div class="login_con">
      <div class="login_top">
        <div class="title">
          <img src="../assets/images/logo_bg_x2.png" alt="">
          E杯好茶店员后台管理平台
        </div>
      </div>
      <div class="login_form">
        <input v-model="userNmae" placeholder="用户名"  type="value" id="userNmae"/>
        <input v-model="password" placeholder="密码" type="password" id="password"/>
        <!-- <div style="border-bottom:1px #dcdcdc solid;padding:5px;margin-bottom:20px;">
          <input v-model="phone" type="text" placeholder="手机号" style="border: none;outline: none;padding: 5px;display:inline-block;
          width:320px;"
           name="">
           <div style="display:inline-block;background:#150f01;border-radius: 5px;
           padding:5px;color:#fff;width:100px;height:40px;line-height:34px;text-align:center;">
              <span v-show="showCountdown === false" @click="getCode">获取验证码</span>
              <span v-show="showCountdown">{{countdown}}s后重发</span>
           </div> 
        </div>
        <input v-model="checkCode" placeholder="验证码" id="checkCode"/> -->
        <div class="login_btn" @click="loginFn">登 录</div>
      </div>
    </div>
</div>
</template>

<script>
import apis from '../env/apis.js'
import axios from '../env/axios.js'
export default {
    name: 'Login',
    data() {
      return {
          userNmae: '',
          password: '',
          phone: '',
          countdown: 60,
          showCountdown: false,
          dialogOpt: {
            type: 'info',
            text: '',
            time: '1500',
            showDialog: false,
            cancelDialog () {
            }
          },
          checkCode: ''
      }
    },
    methods: {
      jumpHome() {
        this.$router.push({path:'/'});
      },
      getCode () {
        let self = this
        let phone = this.phone
        if (phone === '') {
          this.$message({
            message: '请输入手机号',
          });

          return
        }
        // let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
        // if (!reg.test(phone)) {
        //   this.dialogOpt.text = '手机号码格式不正确'
        //   this.dialogOpt.showDialog = true
        //   return
        // }
        this.showCountdown = true
        let tiem = setInterval(function () {
          self.countdown = self.countdown - 1
          if (self.countdown <= 0) {
            clearInterval(tiem)
            self.showCountdown = false
            self.countdown = 60
          }
        }, 1000)

        let parm = {
          phone: phone
        }
        axios.post(apis.getSmsCode,parm).then(res =>{
            //alert(JSON.stringify(res))
            if (res.info === '成功') {
            this.$message({
              message: '验证码发送成功，请注意查收！',
            });
            //this.checkCode = res.data
          }
        }).catch(err => {
            console.log(err)
        })
        
      },
      loginFn () {
        let username = this.userNmae
        let password = this.password
        if (username === '') {
          this.$message({
              message: '请输入用户名',
          });
          return
        }
        if (password === '') {
          this.$message({
              message: '请输入密码',
          });
        }
        
        let pram = {"loginName":username,"password":password}
		    let url = apis.baseUrl+'/tea/cms/login/login'
        axios.post(url,pram).then( res =>{
            if(res.data.code==200){
            this.$router.push({path: '/'})
          }else{
            this.$message({
              message: res.data.msg
            })
          }
        }).catch(function (error) {
          
        });
      },
      cancelDialog () {
        this.dialogOpt.showDialog = false
      }               
    }
}
</script>

<style scoped lang="less">
  .login_con {
    width: 600px;
    height: 500px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 20;
    .login_top {
      width: 100%;
      height: 70px;
      position: relative;
      z-index: 30;
      img {
          height: 65%;
          margin: 0 10px;
          vertical-align: middle;
        }
      
    }
    .login_form {
      width: 100%;
      height: 465px;
      background: #fff;
      margin-top: -35px;
      border-radius: 8px;
      padding: 120px 10%;
      #userNmae, #password, #checkCode {
        width: 100%;
        height: 50px;
        line-height: 50px;
        margin-bottom: 30px;
        border: none;
        outline: none;
        border-bottom: 1px solid #dcdcdc;
        text-indent: 6px;
      }
      .login_btn {
        height: 60px;
        line-height: 60px;
        background-color: #150f01;
        border-radius: 8px;
        text-align: center;
        color: #fff;
        font-size: 22px;
        cursor: pointer;
      }
    }
  }
</style>
