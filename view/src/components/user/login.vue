<template>
  <div id="userLogin">
    <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" ></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" @click.native.prevent="handleSubmit"  style="width:100%;color:#fff">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import md5 from "md5";
  import Api from '../../api';
  import axios from 'axios'
  export default {
    data() {
      return {
        loginForm: {
          username: "",
          password: "",
        },
        rules2: {
          username: [{
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }, ],
          password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }]
        }
      }
    },
    created() {
      var lett = this;
      document.onkeydown = function (e) {
        var key = window.event.keyCode;
        if (key == 13) {
          lett.handleSubmit();
        }
      };
    },
    mounted() {},
    methods: {
      handleSubmit(ev) {
        var _this = this;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            const mdpwd = md5(this.loginForm.password);
            const loginParams = {
              username: this.loginForm.username,
              password: mdpwd,
            };
            Api.users
              .login(loginParams)
              .then(data => {
                if (data.status) {
                  
                  const token = data.data.token;
                  const username = loginParams.username;
                  //保存token 每次请求的时候保存在请求头
                  localStorage.setItem('token', token);
                  //保存用户名渲染在页面顶部
                  localStorage.setItem('username', username);
                  this.$router.push({
                    path: "/picture"
                  });
                } else {
                  this.$message.error('账号或者密码错误');
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
