<template>
  <div id="videoVideoDetail">
    <div class="video_detail_container">
      <div class="content">
        <div class="content_child">
          <div class="image">
            <img :src="ruleForm2.cover_pic" alt="转码中">
          </div>
          <div class="video_link">
            链接：
            <a :href="ruleForm2.video_link">{{video_link}}</a>
          </div>
          <div class="abstract">
            简介：{{ruleForm2.desc}}
          </div>
          <!-- 展示视屏 -->
          <div class="videoShow">
            <video class="video_paly" :src="video_link" controls="controls">
                <source :src="video_link" type="video/mp4" />
                <source :src="video_link" type="video/ogg" />
                <source :src="video_link" type="video/webm" /> -->
                <object id="video_paly" :data="video_link" width="320" height="240">
                  <embed id="video_paly" :src="video_link" width="320" height="240" />
                </object>
              </video>
          </div>
        </div>
      </div>
    </div>
    <div class="mian-videoVideoDetail">
      <div class="left">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
          <el-form-item label="视频名称(目录)：" prop="title">
            <el-input  class="input" type="text" v-model="ruleForm2.title" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="关联的课堂：" class="pic" prop="title2">
            <template>
              <el-input class="input"  type="text"  v-model="handler.title"  :readonly="true"></el-input>
            </template>
        </el-form-item>
        <el-form-item label="是否试听：" :readonly="true">
          <el-radio v-model="ruleForm2.audition" label="yes">是</el-radio>
          <el-radio v-model="ruleForm2.audition" label="no">否</el-radio>
        </el-form-item>
        <el-form-item label="视频简介：">
          <el-input class="input" type="text" v-model="ruleForm2.desc" auto-complete="off" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 视频详情 -->
    <div class="draft">
      <div class="draft">视频文稿</div>
      <div class="editor-container">
        <div class="video-draft" v-html="ruleForm2.content"></div>
      </div>
    </div>
    </div>
        <!-- 视频列表弹窗 -->
    <el-dialog class="video-dialog" width='70%' title="视频选择" :visible.sync="video.listVisible" @open="getVideos">
        
      <div>
        <!-- 课程发布 -->
        <el-form :inline="true" :model="video.query" class="demo-form-inline" ref="publishForm">
          <el-form-item>
            <el-input v-model="video.query.search" placeholder="标题、作者"></el-input>
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
                <div class="pic" ><img :src="item.cover_pic" style="width: 180px; height: 130px" alt=""></div>
                <div class="content">
                  <h2  :title="item.title">{{item.title}}</h2>
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
                    <div class="btn-select"><el-button size="mini" type="info" @click="selectVideo(item.id, item.title)">选择</el-button></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <el-col :span="24" class="toolbar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="video.query.page" :page-size="video.query.count" layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
          </el-pagination>
        </el-col>
        </div>
        <!--底部分页-->
        
      </div>

    </el-dialog>
  </div>

</template>
<style>
#videoVideoDetail strong,
#videoVideoDetail ul,
#videoVideoDetail li,
#videoVideoDetail p,
#videoVideoDetail h1 {
  margin: 0;
  padding: 0;
  list-style: none;
}
#videoVideoDetail .input>input {
  border: 1px solid #fff;
  outline: 0!important;
  border: none
}
/* 视频发布 */
.video_detail_container {
  background-color: #fff;
  margin-bottom: 10px;
}
#videoVideoDetail {
  margin-top: 10px;
}
.mian-videoVideoDetail {
  display: flex;
  margin-bottom: 20px;
}
#videoVideoDetail .left {
  width: 400px;
  /* margin-right: 30px; */
  background: #fff;
}
#videoVideoDetail .demo-ruleForm {
  width: 360px;
  margin-top: 30px;
}
#videoVideoDetail .demo-ruleForm .el-form-item {
  margin-top: 30px;
}
#videoVideoDetail .demo-form-inline {
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 10px;
}
#videoVideoDetail .el-form-item {
  margin-top: 10px;
}
#videoVideoDetail .item {
  border-bottom: 1px solid #ccc;
}
#videoVideoDetail .show_prompt {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 10px;
  margin-top: 20px;
}
/* 视频详情 */
#videoVideoDetail .draft {
  flex: 1;
  background: #fff;
  padding: 10px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
#videoVideoDetail .editor-container {
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  padding: 20px
}
#videoVideoDetail .content {
  overflow: hidden;
}
#videoVideoDetail .content_child {
  float: left;
  margin-left: 50%;
  transform: translateX(-50%);
}
#videoVideoDetail .content .image {
  width: 200px;
  height: 150px;
  margin: auto;
  border: 1px solid #e6ebf5;
  margin-top: 15px;
}
#videoVideoDetail .content .image img {
  width: 200px;
  height: 150px;
  vertical-align: top;
}
#videoVideoDetail .content .video_link {
  text-align: center;
  margin-top: 15px;
}
#videoVideoDetail .content .image img {
  vertical-align: top;
}
#videoVideoDetail .videoShow {
  max-width: 640px;
  max-height: 360px;
  margin: auto;
}
#videoVideoDetail .video_paly {
  width: 100%;
  height: 100%;
}
#videoVideoDetail .abstract {
  text-align: center;
  margin-top: 25px;
}
/* 视频列表样式 */
#videoVideoDetail {
  padding: 0 30px;
}
#videoVideoDetail #course_list {
  padding: 0;
  background-color: #fff;
  margin-top: 0;
  -webkit-margin-after: 0em;
}
#videoVideoDetail .el-form {
  text-align: left;
  padding: 10px 20px 0 20px;
  margin-top: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
}
#videoVideoDetail #course_list li {
  position: relative;
  list-style-type: none;
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}
#videoVideoDetail .el-form-item {
  margin-bottom: 10px;
}
#videoVideoDetail #course_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
}
#videoVideoDetail #course_list .content {
  text-align: left;
  vertical-align: center;
  margin-left: 230px;
  margin-right: 200px;
  height: 150px;
  overflow: hidden;
}
#videoVideoDetail #course_list .content h2 {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#videoVideoDetail #course_list .content .info {
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
#videoVideoDetail #course_list .content .author,
#videoVideoDetail #course_list .content .create-time {
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
#videoVideoDetail .course-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#videoVideoDetail #course_list .content .handle {
  position: absolute;
  color: #5a5e66;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
#videoVideoDetail .btn-select {
  margin: 5px 0;
}
#videoVideoDetail #course_list .content .tag {
  height: 40px;
  line-height: 40px;
}
#videoVideoDetail .el-dialog__body {
  padding: 0;
}
#videoVideoDetail .toolbar {
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
import config from "../../config";
export default {
  data() {
    return {
      ruleForm2: {},
      id: "",
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 500
      },
      title: "",
      writer: "",
      video_link: "",
      //视频描述
      abstract: "",
      cover_pic: "",
      //修改视屏弹出框弹出关闭布尔值 默认为false
      dialog: false,
      page: {
        id: 1
      },
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
          search: null
        }
      },
      headInfo: {
        Authorization: ""
      },

      //验证规则
      rules2: {}
    };
  },
  created() {
    let id = this.$route.query ? this.$route.query.id : null;
    if (typeof id === "undefined") return this.$message.error("参数错误");
    this.id = id
    this.getVideoDetails(id);
    
  },
  methods: {
    getVideoDetails() {
      Api.video.video_details(this.id)
      .then(res =>{
        this.ruleForm2 = res.data
        this.defaultMsg = res.data.content
        this.handler.parent_id = res.data.class_id
        this.getCourseInfo()
      })
    },
      getCourseInfo() {
        let that = this;
        Api.course.details(this.handler.parent_id).then(res => {
          that.handler.title = res.data.title;
        });
      },
    edit() {
      let obj = this.ruleForm2
      obj.class_id = this.handler.parent_id
      obj.content = this.getUEContent()
      Api.video.update_catalogs(this.id,obj)
      .then(res => {
        this.$message.success("更新成功！")
        this.$router.push({
          path:'./uploadList'
        })
      })
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
      this.video.query.page = val;
      this.getVideos();
    },
    handleSizeChange(val) {
      this.video.query.page = 1;
      this.video.query.count = val;
      this.getVideos();
    },
    //弹窗视频列表
    getVideos() {
      Api.course.classes_list(this.video.query).then(response => {
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
    }
  }

};
</script>