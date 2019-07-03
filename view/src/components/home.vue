<template>
  <div id="home">
    <el-row >
        <el-col :span="24" class="header">
          <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
            {{collapsed?'':sysName}}
          </el-col>
          <el-col :span="10">
            <div class="tools" @click.prevent="collapse">
              <i class="fa fa-align-justify"></i>
            </div>
          </el-col>
          <el-col :span="4" class="userinfo">
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link userinfo-inner"><img class="img_logo" :src="avatar" style="width:40px; height: 40px"/> {{showname}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>


        <el-col :span="24" class="main">
          <!-- 导航菜单 -->
          <el-aside  class="sideBar">
            <el-menu  router :default-active='$route.path' theme="dark" class="el-menu-vertical-demo navMenu" unique-opened active-text-color="#409EFF">
              <template  v-for="(item,index) in $router.options.routes" v-if='item.show'>
                <el-submenu  :index="index+''" :key="index">
                  <template slot="title">
                    <i :class="item.icon"></i>{{item.descript}}</template>
                  <el-menu-item  v-for="(child,indexs) in item.children" :key="indexs" :index="child.path" v-if='child.show'>{{child.name}}</el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </el-aside>
        <section class="content-container">
          <div class="content_container_box">
            <el-col :span="24" class="breadcrumb-container Breadcrumb ">
              <strong class="title">{{$route.name}}</strong>
              <el-breadcrumb separator="/" class="breadcrumb-inner">
                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                  {{ item.meta.routerName }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-col>
          </div>
        </section>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import Api from "../api";
import routes from "../router/index.js";
  export default {
    data() {
      return {
        sysName: "重建自我课堂",
        collapsed: false,
        showname: "",
        avatar: "../static/logo.png",
      }
    },
    beforeCreate() {
      // location.reload()
    },
    created() {
      this.getLogin();
    },
    mounted() {
      
    },
    methods: {
      getLogin() {
        this.showname = localStorage.getItem('username');
      },
      logout() {
        localStorage.removeItem('token');
        this.$router.push({
          path: '/login'
        })

      },
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html, body {
  height: 100%;
}
.el-row {
  height: 100%;
}
.userinfo-inner {
  color: #fff
}
  #home {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  }
  #home .head {
    height: .75rem;
    line-height: .75rem;
    /* border-bottom: .02rem solid #ffffff; */
    position: absolute;
    background: #242f42;
    margin-bottom: 0;
  }
  #home .header {
    position: relative;
    height: 70px;
    background-color: #242f42;
    line-height: 70px;
    /* border-bottom: 1px solid #ccc; */
    z-index: 1;
  }
  #home .logo {
      text-align: left;
      height: 70px;
      width: 250px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      background: #242f42;
      color: #ffffff;
  }
  #home .img_logo {
        width: 40px;
        border-radius: 100%;
        float: left;
        margin: 10px 10px 10px 18px;
      }
  #home .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      color:#409EFF;
    }
  #home .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
        }
  #home .name {
    color: #ddd
  }
  #home .title {
    font-size: .14rem;
  }
  .noting {
    text-align: center;
    font-size: 22px;
    color: #ccc;
    padding: 15px;
    background-color: #ffffff;
  }
  #home .out {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 20%;
    /* height: 100%; */
    line-height: inherit;
    font-size: .16rem;
  }
  #home .main {
    display: flex;
    position: absolute;
    /* align-items:stretch; */
    top:70px;
    bottom: 0;
    overflow: hidden;
  }
  #home .el-dropdown-link {
    cursor: pointer;
  }
  #home .el-menu {
    background-color: #324157 ;
    
  }
  #home .sideBar {
    /* height: 100%; */
    width: 250px;
    flex: 0 0 250px;
    background-color: #324157 ;
    min-height: 800px;
  }

  #home .el-menu {
    border: 0;

  }
  /* 设置侧边栏字体颜色 */
  #home .el-submenu__title {
    text-align: left;
  }
  #home .el-submenu__title,
  #home i {
    color: #ddd;
  }
  #home .el-submenu__title:hover {
    background-color: #222;
    color: #fff;
  }
  #home .el-menu-item {
    text-align: left;
    color: #ddd;
    background-color: #383d40 ;
  }
   #home .el-menu-item:hover {
     background-color: #222;
     color: #409EFF;
   }
   #home .el-menu-item:visited {
     background-color: #146197;
     color: #146197;
   }
  #home .content-container {
      background:#f2f2f2 ;
      /* background:#fff ; */
      flex: 1;
      overflow-y: scroll;
      /* padding: 30px; */
      padding-bottom: 0;
  }
  #home .content_container_box {
    height: 100%;
  }
  #home .breadcrumb-container {
      /* box-shadow: 2px 2px 2px #dfe4ed; */
      background: #fff;
      height: 60px;
      line-height: 60px;
      padding: 0 30px;
    }
  #home .breadcrumb-container .title {
      float: left;
      color: #475669;
      line-height: 60px;
}
  #home .breadcrumb-inner {
    float: right;
    line-height: 60px;
  }
  #home .breadcrumb-inner .el-breadcrumb__inner{
    font-weight:700;
  }
  #home .content-wrapper {
      box-sizing: border-box;
    }
  #home .el-container {
    /* background-color: #Ecf5ff; */
     background-color: #F2F2F2;
  }
  #home .container {
    /* float: left; */
    flex: 1;
    border-left: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }
  .toolbar, .left {
    /* box-shadow: 2px 2px 2px #dfe4ed; */
  }
</style>
