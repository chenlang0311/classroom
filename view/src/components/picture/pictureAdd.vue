<template>
  <div id="picture">
    <el-form ref="form" :rules="rules" :model="form" label-width="160px">
      <el-form-item label="轮播图优先级(1~99)" class="pic" prop="level">
        <el-input-number size="mini" v-model="form.level" controls-position="right" @change="handleChange" :min="1" :max="99"></el-input-number>
      </el-form-item>
      <el-form-item label="课程名称" class="pic" prop="title2">
        <template>
          <el-input style="width: 50%;" suffix-icon="el-icon-search" type="text" placeholder="请选择..." v-model="handler.title" @focus="video.listVisible=true" :readonly="true"></el-input>
        </template>
      </el-form-item>
      <el-form-item label="轮播图标题" class="pic">
        <el-input type="text" v-model="form.abstract" style="width: 50%;"></el-input>
      </el-form-item>
      <el-form-item label="上传轮播图(建议尺寸 690*320)" class="pic" prop="pic">
        <el-upload name="uploadimg" class="avatar-uploader" :action="upload_way + '/uploads/uploadimg'" :headers="headInfo" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item class="pic">
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>

    <!-- 视频列表弹窗 -->
    <el-dialog class="video-dialog" width='70%' title="课程选择" :visible.sync="video.listVisible" @open="getVideos">

      <div>
        <!-- 课程发布 -->
        <el-form :inline="true" :model="query" class="demo-form-inline" ref="publishForm">
          <el-form-item>
            <el-input v-model="query.search" placeholder="标题、作者"></el-input>
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
                <div class="pic"><img :src="item.cover_pic" style="width: 180px; height: 130px" alt=""></div>
                <div class="content">
                  <h2 :title="item.title">{{item.title}}</h2>
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
                      原价：{{item.original_price}}元
                    </div>
                    <div class="creat-time-price">
                      现价：{{item.price}}元
                    </div>
                  </div>
                  <div class="create-time course-desc">
                    课程简介：{{item.desc}}
                  </div>
                  <div class="handle">
                    <!-- <el-tag v-if="item.audit_audit !== 'pass'" class="tag" type="danger">{{item.audit_audit==null?'未审核':(item.audit_audit=='fail'?'审核未通过':'')}}</el-tag> -->
                    <div class="btn">
                      <el-button size="mini" type="info" @click="selectVideo(item.id, item.title)">选择</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <el-col :span="24" class="toolbar">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page" :page-size="query.count" layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
            </el-pagination>
          </el-col>
        </div>
        <!--底部分页-->

      </div>

    </el-dialog>
  </div>

</template>

<style>
#picture .pic {
  text-align: left;
}
#picture .el-form {
  text-align: left;
  padding: 10px 20px;
  background-color: #ffffff;
  margin-top: 10px;
}
#picture .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#picture .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#picture .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#picture .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/* 视频列表样式 */
#picture {
  padding: 0 30px;
  background-color: #fff;
}
#picture #course_list {
  padding: 0;
  background-color: #fff;
  margin-top: 0;
  -webkit-margin-after: 0em;
}
#picture .el-form {
  text-align: left;
  padding: 10px 20px 0 20px;
  margin-top: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
}
#picture #course_list li {
  position: relative;
  list-style-type: none;
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}
#picture .el-form-item {
  margin-bottom: 10px;
}
#picture #course_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
}
#picture #course_list .content {
  text-align: left;
  vertical-align: center;
  margin-left: 230px;
  margin-right: 200px;
  height: 150px;
  overflow: hidden;
}
#picture #course_list .content h2 {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#picture #course_list .content .info {
  /* position: absolute; */
  font-size: 12px;
  color: #5a5e66;
  margin-bottom: 5px;
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
#picture #course_list .content .author,
#picture #course_list .content .create-time {
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
#picture .course-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#picture #course_list .content .handle {
  position: absolute;
  color: #5a5e66;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
#picture .btn {
  margin: 5px 0;
}
#picture #course_list .content .tag {
  height: 40px;
  line-height: 40px;
}
#picture .el-dialog__body {
  padding: 0;
}
#picture .toolbar {
  background-color: #fff;
  height: 60px;
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 15px;
}
</style>

<script>
import Api from "../../api";
//引入配置的图片测试环境下的路径
import config from "../../config";
export default {
  data() {
    return {
      //上传文章封面图片你的路径
      upload_way: "",
      headInfo: {
        Authorization: ""
      },
      query: {
        page: 1,
        count: 10,
        exist: "1",
        search: null
      },
      imageUrl: "",
      pic: "",
      handler: {
        parent_id: null,
        title: null
      },
      pages: [],
      videos: [],
      video: {
        listVisible: false,
        query: {
          page: 1,
          count: 10,
          category: null,
          create_time: "*",
          search: null
        }
      },
      form: {},
      total_rows: 0,
      //验证规则
      rules: {}
    };
  },
  watch: {},
  mounted() {
    this.upload_way = config.CRM;
    this.headInfo.Authorization = localStorage.getItem("token");
  },
  methods: {
    //优先级改变值
    handleChange(value) {},
    handleAvatarSuccess(res, file) {
      this.pic = res.data.name;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp" ||
        file.type === "image/bmp";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJpgOrPng) {
        this.$message.error("上传图片只能是jpg、png、webp或者BMP格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJpgOrPng && isLt1M;
    },

    //视频搜所
    send_query() {
      this.getVideos();
    },
    //选择视频
    selectVideo(id, title) {
      this.handler.parent_id = id;
      this.handler.title = title;
      this.video.listVisible = false;
    },
    //视频分页
    handleCurrentChange(val) {
      this.query.page = val;
      this.getVideos();
    },
    handleSizeChange(val) {
      this.query.page = 1;
      this.query.count = val;
      this.getVideos();
    },
    //弹窗视频列表
    getVideos() {
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
    //上传图片
    onSubmit() {
      let obj = {
        parent_id: this.handler.parent_id,
        category: "home",
        pic: this.pic,
        title: this.form.abstract,
        level: this.form.level,
        channel: "classes"
      };
      Api.course.addPic(obj).then(response => {
        this.$message.success("上传成功！");
        this.$router.push({
          path: "/picture/pictureList"
        });
      });
    }
  }
};
</script>




