<template>
  <div id="videoVideoEdit">
    <div class="video_detail_container">
      <div class="content">
        <div class="content_child">
          <div class="image">
            <img :src="ruleForm2.cover_pic" alt="转码中">
          </div>
          <div class="video_link">
            链接：
            <a :href="ruleForm2.video_link">{{ruleForm2.video_link}}</a>
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
    <div class="mian-videoVideoEdit">
      <div class="left">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
          <el-form-item label="目录名称：" prop="title">
            <el-input type="text" v-model="ruleForm2.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="关联的课堂" class="pic" prop="title2">
            <template>
              <el-input  suffix-icon="el-icon-search" type="text" placeholder="请选择..." v-model="handler.title" @focus="video.listVisible=true" :readonly="true"></el-input>
            </template>
        </el-form-item>
        <el-form-item label="是否试听：">
          <el-radio v-model="ruleForm2.audition" label="yes">是</el-radio>
          <el-radio v-model="ruleForm2.audition" label="no">否</el-radio>
        </el-form-item>
        <el-form-item label="目录简介：">
          <el-input type="text" v-model="ruleForm2.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click='edit'>确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 视频详情 -->
    <div class="draft">
      <div class="draft-text">视频文稿</div>
      <div class="editor-container">
      <script id="container" type="text/plain">

      </script>
        <v-ue :defaultMsg=defaultMsg :config=config ref="ue" style="max-width: 100%!important"></v-ue>
      </div>
    </div>
    </div>
        <!-- 视频列表弹窗 -->
    <el-dialog class="video-dialog" width='70%' title="课程选择" :visible.sync="video.listVisible" @open="getVideos">
        
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
#videoVideoEdit strong,
#videoVideoEdit ul,
#videoVideoEdit li,
#videoVideoEdit p,
#videoVideoEdit h1 {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 视频发布 */
.video_detail_container {
  background-color: #fff;
  margin-bottom: 10px;
}
#videoVideoEdit {
  margin-top: 10px;
}
.mian-videoVideoEdit {
  display: flex;
  margin-bottom: 20px;
}
#videoVideoEdit .left {
  width: 400px;
  /* margin-right: 30px; */
  background: #fff;
}
#videoVideoEdit .demo-ruleForm {
  width: 360px;
  margin-top: 30px;
}
#videoVideoEdit .demo-ruleForm .el-form-item {
  margin-top: 30px;
}
#videoVideoEdit .demo-form-inline {
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 10px;
}
#videoVideoEdit .el-form-item {
  margin-top: 10px;
}
#videoVideoEdit .item {
  border-bottom: 1px solid #ccc;
}
#videoVideoEdit .show_prompt {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 10px;
  margin-top: 20px;
}
/* 视频详情 */
#videoVideoEdit .editor-container {
    width: 600px;
     margin: 0 auto
}
#videoVideoEdit .draft {
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
#videoVideoEdit .draft-text {
  width: 600px;
  margin: 20px auto;
  font-size: 14px;
  color: #5a5e66;
  
}
#videoVideoEdit .content {
  overflow: hidden;
}
#videoVideoEdit .content_child {
  float: left;
  margin-left: 50%;
  transform: translateX(-50%);
}
#videoVideoEdit .content .image {
  width: 200px;
  height: 150px;
  margin: auto;
  border: 1px solid #e6ebf5;
  margin-top: 15px;
}
#videoVideoEdit .content .image img {
  width: 200px;
  height: 150px;
  vertical-align: top;
}
#videoVideoEdit .content .video_link {
  text-align: center;
  margin-top: 15px;
}
#videoVideoEdit .content .image img {
  vertical-align: top;
}
#videoVideoEdit .videoShow {
  max-width: 640px;
  max-height: 360px;
  margin: auto;
}
#videoVideoEdit .video_paly {
  width: 100%;
  height: 100%;
}
#videoVideoEdit .abstract {
  text-align: center;
  margin-top: 25px;
}
/* 视频列表样式 */
#videoVideoEdit {
  padding: 0 30px;
}
#videoVideoEdit #course_list {
  padding: 0;
  background-color: #fff;
  margin-top: 0;
  -webkit-margin-after: 0em;
}
#videoVideoEdit .el-form {
  text-align: left;
  padding: 10px 20px 0 20px;
  margin-top: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
}
#videoVideoEdit #course_list li {
  position: relative;
  list-style-type: none;
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}
#videoVideoEdit .el-form-item {
  margin-bottom: 10px;
}
#videoVideoEdit #course_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
}
#videoVideoEdit #course_list .content {
  text-align: left;
  vertical-align: center;
  margin-left: 230px;
  margin-right: 200px;
  height: 150px;
  overflow: hidden;
}
#videoVideoEdit #course_list .content h2 {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#videoVideoEdit #course_list .content .info {
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
#videoVideoEdit #course_list .content .author,
#videoVideoEdit #course_list .content .create-time {
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
#videoVideoEdit .course-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#videoVideoEdit #course_list .content .handle {
  position: absolute;
  color: #5a5e66;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
#videoVideoEdit .btn-select {
  margin: 5px 0;
}
#videoVideoEdit #course_list .content .tag {
  height: 40px;
  line-height: 40px;
}
#videoVideoEdit .el-dialog__body {
  padding: 0;
}
#videoVideoEdit .toolbar {
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
import Ue from "../../assets/ue.vue";
import config from "../../config";
export default {
  components: {
    "v-ue": Ue
  },
  data() {
    //自定义验证规则函数
    var checkAge = (rule, value, callback) => {
      if (this.publish.remember_platform == "") {
        callback(new Error("请选择发布平台"));
      } else {
        callback();
      }
    };
    var checkAge2 = (rule, value, callback) => {
      if (this.publish.remember_account.length == 0) {
        callback(new Error("请选择发布账号"));
      } else {
        callback();
      }
    };
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
      class_id: '',

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
        this.$router.go(-1)
      })
    },
          //获取编辑器中编辑的内容
      getUEContent() {
        let content2 = this.$refs.ue.getUEContent();
        return content2;
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
  },
  mounted() {
    var that = this;
    var index = 0;
    var cosBox = [];
    // 编辑器
    var that = this;
    this.upload_way = config.CRM;
    this.$refs.ue.editor.ready(function() {
      that.$refs.ue.editor.addListener("contentChange", function() {
        //在编辑文章过程中前台需要将编辑在页面上的图片实时传输至后台，保存至后台的图片临时保存目录
        // 解析文本内容获取img标签推入一个数组,再获取img中src属性值来传输至后台
        //获取渲染eidtor这个div盒子
        var container = document.getElementById("container");
        //获取iframe文本编辑区域
        var iframe = UE.dom.domUtils.getElementsByTagName(
          container,
          "iframe"
        )[0];
        //获取编辑区域的img标签集合
        var imgs = iframe.contentDocument.body.getElementsByTagName("img");
        //防止imgs长度为0 img是 不是一个数组 但是可以循环 console.log(imgs instanceof Array);输出为false
        if (imgs.length > 0) {
          for (var i = 0; i < imgs.length; i++) {
            imgs[i].style["max-width"] = "100%";
            // imgs[i].style['height'] = 'auto'
            imgs[i].style["margin-left"] = "50%";
            imgs[i].style["transform"] = "translateX(-50%)";
            // var style = window.getComputedStyle(imgs[i],null);
            // console.log(style.width)
            // 判断一下，已经处理过的图片就不需要再次处理了
            if (imgs[i].getAttribute("post_time")) {
              //存在的时候就不做处理了
            } else {
              UE.dom.domUtils.setAttributes(imgs[i], {
                post_time: `${Math.random()}_${i}_${Date.parse(new Date())}`
                // 'width': '100%!important',
              });
              var post_time = imgs[i].getAttribute("post_time");
              var img_src = imgs[i].getAttribute("src");
              //处理src属性值 变成后台需要的参数形式
              var obj = {
                img_src: img_src,
                sign: post_time
              };
              // 上传图片真实src 获取本地src值
              Api.articleList.post_image(obj).then(res => {
                for (let j = 0; j < imgs.length; j++) {
                  if (imgs[j].getAttribute("post_time") == res.sign) {
                    // 临时创建wh_src属性来标记每个请求  实际要写src
                    UE.dom.domUtils.setAttributes(imgs[j], {
                      src: `${config.imageHost}${res.data}`
                    });
                    //这个设置很关键，如果只设置src，那么在保存的时候查看文章内容src又会变为原来的地址，
                    //因为原来的内容里面还有一个_src属性，如果不改掉_src，那么保存的 时候就src的值又会变为_src里面的值
                    UE.dom.domUtils.setAttributes(imgs[j], {
                      _src: `${config.imageHost}${res.data}`
                    });
                  }
                }
              });
            } //else
          } //for
        } //imgs.length > 0
      }); //contentChange
    }); //ready
    //上传图片加请求头
    this.headInfo.Authorization = localStorage.getItem("token");
    /**
     * 计算签名
     **/
    var getSignature = function(callback) {
      Api.video
        .get_sha()
        .then(res => {
          var signature = res.data;
          callback(signature);
        })
        .catch(res => {});
    };
    /**
     * 添加上传信息模块
     */
    var addUploaderMsgBox = function(type) {
      var html = '<div class="uploaderMsgBox" name="box' + index + '">';
      if (!type || type == "hasVideo") {
        html +=
          '视频名称：<span name="videoname' +
          index +
          '"></span>；' +
          '计算sha进度：<span name="videosha' +
          index +
          '">0%</span>；' +
          '上传进度：<span name="videocurr' +
          index +
          '">0%</span>；' +
          'fileId：<span name="videofileId' +
          index +
          '">   </span>；' +
          '上传结果：<span name="videoresult' +
          index +
          '">   </span>；<br>' +
          '地址：<span name="videourl' +
          index +
          '">   </span>；' +
          '<a href="javascript:void(0);" name="cancel' +
          index +
          '" cosnum=' +
          index +
          ' act="cancel-upload">取消上传</a><br>';
      }
      if (!type || type == "hasCover") {
        html +=
          '封面名称：<span name="covername' +
          index +
          '"></span>；' +
          '计算sha进度：<span name="coversha' +
          index +
          '">0%</span>；' +
          '上传进度：<span name="covercurr' +
          index +
          '">0%</span>；' +
          '上传结果：<span name="coverresult' +
          index +
          '">   </span>；<br>' +
          '地址：<span name="coverurl' +
          index +
          '">   </span>；<br>' +
          "</div>";
      }
      html += "</div>";
      $("#resultBox").append(html);
      return index++;
    };
    /*
       * 取消上传绑定事件，示例一与示例二通用
       */
    $("#resultBox").on("click", "[act=cancel-upload]", function() {
      var cancelresult = qcVideo.ugcUploader.cancel({
        cos: cosBox[$(this).attr("cosnum")],
        taskId: $(this).attr("taskId")
      });
    });
    /**
     * 上传视频+封面
     **/
    var videoFileList = [];
    var coverFileList = [];
    // 给addVideo添加监听事件
    $("#addVideo-file").on("change", function(e) {
      var videoFile = this.files[0];
      videoFileList[0] = videoFile;
      $("#result").append(videoFile.name + "\n");
    });
    $("#addVideo").on("click", function() {
      $("#addVideo-file").click();
    });
    // 给addCover添加监听事件
    $("#addCover-file").on("change", function(e) {
      var coverFile = this.files[0];
      coverFileList[0] = coverFile;
      $("#result").append(coverFile.name + "\n");
    });
    $("#addCover").on("click", function() {
      $("#addCover-file").click();
    });
    var startUploader = function() {
      if (videoFileList.length) {
        var num = addUploaderMsgBox();
        if (!coverFileList[0]) {
          $("[name=covername" + num + "]").text("没有上传封面");
        }
        var resultMsg = qcVideo.ugcUploader.start({
          videoFile: videoFileList[0],
          coverFile: coverFileList[0],
          getSignature: getSignature,
          allowAudio: 1,
          success: function(result) {
            if (result.type == "video") {
              $("[name=videoresult" + num + "]").text("上传成功");
              $("[name=cancel" + num + "]").remove();
              cosBox[num] = null;
            } else if (result.type == "cover") {
              $("[name=coverresult" + num + "]").text("上传成功");
            }
          },
          error: function(result) {
            if (result.type == "video") {
              $("[name=videoresult" + num + "]").text(
                "上传失败>>" + result.msg
              );
            } else if (result.type == "cover") {
              $("[name=coverresult" + num + "]").text(
                "上传失败>>" + result.msg
              );
            }
          },
          progress: function(result) {
            if (result.type == "video") {
              $("[name=videoname" + num + "]").text(result.name);
              $("[name=videosha" + num + "]").text(
                Math.floor(result.shacurr * 100) + "%"
              );
              $("[name=videocurr" + num + "]").text(
                Math.floor(result.curr * 100) + "%"
              );
              $("[name=cancel" + num + "]").attr("taskId", result.taskId);
              cosBox[num] = result.cos;
            } else if (result.type == "cover") {
              $("[name=covername" + num + "]").text(result.name);
              $("[name=coversha" + num + "]").text(
                Math.floor(result.shacurr * 100) + "%"
              );
              $("[name=covercurr" + num + "]").text(
                Math.floor(result.curr * 100) + "%"
              );
            }
          },
          finish: function(result) {
            $("[name=videofileId" + num + "]").text(result.fileId);
            $("[name=videourl" + num + "]").text(result.videoUrl);
            if (result.coverUrl) {
              $("[name=coverurl" + num + "]").text(result.coverUrl);
            }
            if (result.message) {
              $("[name=videofileId" + num + "]").text(result.message);
            }
            var obj = {
              fileid: result.fileId,
              title: that.ruleForm2.title,
              audition: that.ruleForm2.audition,
              video_link: result.videoUrl,
              cover_pic: result.coverUrl,
              desc: that.ruleForm2.desc,
              content: that.getUEContent(),
              class_id: that.handler.parent_id
            };
            that.post_info(obj);
          }
        });
        if (resultMsg) {
          $("[name=box" + num + "]").text(resultMsg);
        }
      } else {
        $("#result").append("请添加视频！\n");
      }
    };
    // 上传按钮点击事件   ！！！！！！点击上传的时候要先判断标题是否已经输入了
    $("#uploadFile").on("click", function() {
      that.can_post("ruleForm2");
      if (that.if_post) {
        var secretId = $("#secretId").val();
        var secretKey = $("#secretKey").val();
        startUploader();
        $("#form2")[0].reset();
      } else {
        that.$message.error("请将信息填写完整");
      }
    });
  }
};
</script>