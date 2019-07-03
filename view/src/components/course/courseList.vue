<template>
  <div id="courseList">
    <div>
      <!-- 课程发布 -->
      <el-form :inline="true" :model="query" class="demo-form-inline padding30" ref="publishForm">
        <el-form-item>
          <el-input v-model="query.search" placeholder="标题、作者" @keyup.enter.native="send_query"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="send_query">搜索</el-button>
        </el-form-item>
      </el-form>
      <!--课程列表-->
      <div class="noting" v-if="this.pages==[]||this.pages==null||this.pages==''">
        暂无数据
      </div>
      <div v-else>
        <ul id="course_list">
          <li v-for="item in pages" :key="item.id">
            <div class="page_item">
              <div class="pic" @click="toDetail(item.id,item.audit_audit)"><img :src="item.cover_pic" style="width: 180px; height: 130px" alt=""></div>
              <div class="content">
                <h2 @click="toDetail(item.id,item.audit_audit)" :title="item.title">{{item.title}}</h2>
                <div class="author">
                  <div class="author-author">作者：{{item.author}}
                  </div>
                  <div class="author-abstract">{{item.author_abstract}}
                    <div class="border-line" v-if="item.author_abstract"></div>
                  </div>
                </div>
                <div class="create-time">
                  <div class="create-time-time">
                    创建时间：{{item.created}}
                  </div>
                  <div class="creat-time-original_price">
                    原价：{{parseFloat(item.original_price)/100}}元
                  </div>
                  <div class="creat-time-price">
                    现价：{{parseFloat(item.price)/100}}元
                  </div>
                </div>
                <div class="create-time course-desc">
                  课程简介：{{item.abstract}}
                </div>
                <div class="handle">
                  <!-- <el-tag v-if="item.audit_audit !== 'pass'" class="tag" type="danger">{{item.audit_audit==null?'未审核':(item.audit_audit=='fail'?'审核未通过':'')}}</el-tag> -->
                  <div class="btn">
                    <el-button size="mini" type="primary" @click="toMenu(item)">目录管理</el-button>
                  </div>
                  <div class="btn">
                    <el-button size="mini" type="info" @click="toDetail(item.id)">详情</el-button>
                  </div>
                  <div class="btn">
                    <el-button size="mini" type="success" @click="toUpdate(item.id)">修改</el-button>
                  </div>
                  <div class="btn">
                    <el-button size="mini" type="danger" @click="deleteClass(item.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--底部分页-->
      <el-col :span="24" class="toolbar2">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page" :page-size="query.count" layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
  </div>
</template>

<style>
#courseList {
  /* padding: 0 30px; */
  background-color: #fff;
}
#courseList #course_list {
  padding: 0 30px;
  background-color: #fff;
  margin-top: 0;
  -webkit-margin-after: 0em;
}
#courseList .el-form {
  text-align: left;
  padding: 10px 30px 0 30px;
  margin-top: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
}
#courseList #course_list li {
  position: relative;
  list-style-type: none;
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}
#courseList .el-form-item {
  margin-bottom: 10px;
}
#courseList #course_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
}
#courseList #course_list .content {
  text-align: left;
  vertical-align: center;
  margin-left: 230px;
  margin-right: 330px;
  height: 150px;
  overflow: hidden;
}
#courseList #course_list .content h2 {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#courseList #course_list .content .info {
  /* position: absolute; */
  font-size: 12px;
  color: #5a5e66;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.author {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.author-author,
.author-abstract {
  display: inline-block;
  margin-right: 10px;
  position: relative;
}
.border-line {
  position: absolute;
  height: 15px;
  width: 1px;
  top: 2px;
  left: -6px;
  background-color: #ccc;
}
#courseList #course_list .content .author,
#courseList #course_list .content .create-time {
  /* position: absolute; */
  margin-top: 5px;
  color: #5a5e66;
  font-size: 12px;
}
.create-time-time,
.creat-time-original_price,
.creat-time-price {
  display: inline-block;
  margin-right: 10px;
  position: relative;
}
.create-time-time {
  margin-right: 20px;
}
#courseList .course-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#courseList #course_list .content .handle {
  position: absolute;
  color: #5a5e66;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
#courseList .btn {
  float: left;
  margin: 0 3px;
}
#courseList #course_list .content .tag {
  height: 40px;
  line-height: 40px;
}
#courseList .toolbar2 {
  margin-top: 10px;
  background-color: #fff;
  height: 60px;
  padding: 0 30px;
  width: 100%;
}
.el-pagination {
  margin-top: 15px;
}
</style>

<script>
import axios from "axios";
import Api from "../../api";
export default {
  data() {
    return {
      pages: [],
      // 二级联动
      query: {
        page: 1,
        count: 10,
        exist: "1",
        search: null
      },
      checkState: null,
      total_rows: 0,
      scrollPos: ""
    };
  },
  created() {
    this.getCourse();
    let that = this;
    setTimeout(() => {
      document.getElementsByClassName("content-container")[0].onscroll = e => {
        that.scrollPos = e.target.scrollTop;
      };
    });
  },
  mounted() {},
  activated() {
    this.getCourse();
  },
  methods: {
    toDetail(id) {
      this.$router.push({
        path: "/course/courseInfo",
        query: {
          id: id,
          pos: this.scrollPos || 0
        }
      });
    },
    deleteClass(id) {
      Api.course.calss_deleted(id).then(res => {
        this.$message.success("删除成功！");
        this.getCourse();
      });
    },
    toUpdate(id) {
      this.$router.push({
        path: "/course/courseUpdate",
        query: {
          id: id,
          pos: this.scrollPos || 0
        }
      });
    },
    toMenu(item) {
      this.$router.push({
        path: "/course/menu",
        query: {
          id: item.id,
          pos: this.scrollPos || 0
        }
      });
    },
    //搜索
    send_query() {
      this.getCourse();
    },
    //获取课程列表
    getCourse() {
      Api.course.classes_list(this.query).then(response => {
        this.pages = response.data;
        this.total_rows = response.total;
        for (var i = 0; i < response.data.length; i++) {
          let obj = response.data[i];
          let time = new Date(obj.created);
          let year = time.getFullYear();
          let month = time.getMonth() + 1;
          let day = time.getDate();
          this.pages[i].created = `${year}年${month}月${day}日`;
          if (obj.cover_pic) {
            this.pages[i].cover_pic = obj.cover_pic;
          }
          if (this.pages[i].cover_pic == "") {
            this.pages[i].cover_pic = "../../../static/pic/nopic.png";
          }
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.query.page = val;
      this.getCourse();
    },
    handleSizeChange(val) {
      this.query.page = 1;
      this.query.count = val;
      this.getCourse();
    }
  }
};
</script>

<style scoped>

</style>
