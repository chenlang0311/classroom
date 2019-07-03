<template>
  <div id="videoUpload">
    <div class="left">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
        <el-form-item label="目录名称：" prop="title">
          <el-input type="text" v-model="ruleForm2.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否试听：">
          <el-radio v-model="ruleForm2.audition" label="yes">是</el-radio>
          <el-radio v-model="ruleForm2.audition" label="no">否</el-radio>
        </el-form-item>
        <el-form-item label="视/音频简介：">
          <el-input type="text" v-model="ruleForm2.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="视/音频文件：" class="videoArea" >
          <el-button class="chooseVideo" type="primary" id="addVideo">选择视/音频</el-button>
          <el-input type="text" auto-complete="off" placeholder="请点击右侧按钮选择视/音频" v-model="videoFile" readonly></el-input>
        </el-form-item>
        <el-form-item label="视/音频封面：" >
          <el-button class="choosePic" type="primary" id="addCover">选择封面</el-button>
          <el-input type="text" auto-complete="off" placeholder="请点击右侧按钮选择封面" v-model="picFile" readonly></el-input>
        </el-form-item>
        <el-form-item label="" class="start">
          <el-button class="startUpload" type="primary" id="uploadFile">开始上传</el-button>
        </el-form-item>
        <el-form-item label="" class="start">
          <el-button class="startUpload submit" type="success" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
      <form id="form2">
        <input ref="videoFile" id="addVideo-file" type="file" style="display:none;" @change="remeberVideoFile" accept="video/*, audio/*">
        <input ref="picFile" id="addCover-file" type="file" style="display:none;" @change="remeberPicFile" accept=" image/*">
      </form>
      <div class="row" id="resultBox"></div>
    </div>
    <div class="right">
      <div class="draft">视/音频文稿</div>
      <div class="editor-container">
      <script id="container" type="text/plain">

      </script>
        <v-ue :defaultMsg=defaultMsg :config=config ref="ue" style="max-width: 100%!important"></v-ue>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "../../api";
import Ue from "../../assets/ue.vue";
import config from "../../config";
export default {
  components: {
    "v-ue": Ue
  },
  data() {
    var checkVideo = (rule, value, callback) => {
      if (this.$refs.videoFile.files.length == 0) {
        callback(new Error("请选择视频"));
      } else {
        callback();
      }
    };
    var checkFile = (rule, value, callback) => {
      if (this.$refs.picFile.files.length == 0) {
        callback(new Error("请选择封面文件"));
      } else {
        callback();
      }
    };
    return {
      index: 0,
      cosBox: [],
      options: [],
      obj: {},
      // 在点击上传按钮的时候先判断作者和标题是填写
      if_post: false,
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 500
      },
      headInfo: {
        Authorization: ""
      },
      class_id: "",
      pages: [],
      // 记录只上传视频时候视频文件名字
      // only_video: null,
      // 记录视频文件名称
      videoFile: "",
      // 记录封面文件名称
      picFile: "",
      ruleForm2: {
        title: "",
        desc: "",
        class_name: null,
        audition: "no"
      },
      rules2: {
        title: [
          {
            required: true,
            message: "请输入视频名称",
            trigger: "blur"
          }
        ],
        videoFile: [
          {
            validator: checkVideo,
            trigger: "blur change"
          }
        ],
        picFile: [
          {
            validator: checkFile,
            trigger: "blur change"
          }
        ],
        author: [
          {
            required: true,
            message: "请输入作者名称",
            trigger: "blur"
          }
        ],
        abstract: [
          {
            required: true,
            message: "请输入视频简介",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.class_id = this.$route.query.class_id
      ? this.$route.query.class_id
      : "";
  },
  methods: {
    //视频上传完成返回fileid之后将相关信息提交至后台
    post_info(obj) {
      Api.video
        .post_info(obj)
        .then(res => {
          this.$message.success("添加成功");
          this.resetForm("ruleForm2");
          this.defaultMsg = "";
        })
        .catch(res => {
          this.$message.error("上传失败，请从新选择文件上传");
        });
    },
    submit() {
      let that = this;
      that.obj.title = that.ruleForm2.title
      that.obj.audition = that.ruleForm2.audition
      that.obj.desc = that.ruleForm2.desc
      that.obj.content = that.getUEContent()
      this.$refs["ruleForm2"].validate(valid => {
        if (valid) {
          if (that.getUEContent()) {
            that.post_info(this.obj);
          } else {
            this.$message.error("请填写视频文稿");
          }
        }
      });
    },
    //获取编辑器中编辑的内容
    getUEContent() {
      let content2 = this.$refs.ue.getUEContent();
      return content2;
    },
    //判断is_post 为true之后，既标题填写了之后才能上传视频
    can_post(formName) {
      let that = this;
      this.if_post = true;
    },
    //选择视频文件之后将视频名字自动填入input框中
    remeberVideoFile() {
      this.videoFile = this.$refs.videoFile.files[0].name;
    },
    //选择封面文件之后将封面名字自动填入input框中
    remeberPicFile() {
      this.picFile = this.$refs.picFile.files[0].name;
    },
    //清空表单方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm2.author = "";
      this.ruleForm2.abstract = "";
      this.ruleForm2.desc = "";
      this.ruleForm2.class_name = "";
      this.videoFile = "";
      this.picFile = "";
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
            that.obj = {
              fileid: result.fileId,
              title: that.ruleForm2.title,
              audition: that.ruleForm2.audition,
              video_link: result.videoUrl,
              cover_pic: result.coverUrl,
              desc: that.ruleForm2.desc,
              content: that.getUEContent(),
              class_id: that.class_id
            };
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

<style>
#videoUpload {
  background-color: #fff;
  margin-top: 10px;
  padding: 20px;
  display: flex;
}
#videoUpload .left {
  width: 400px;
}
#videoUpload .right {
  flex: 1;
  margin-left: 150px;
}
#videoUpload .editor-container {
  width: 600px;
  margin: 0 auto;
}
#videoUpload .draft {
  width: 600px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #5a5e66;
}
#videoUpload .demo-ruleForm {
  width: 400px;
  margin-top: 30px;
}
#videoUpload .demo-ruleForm .el-form-item {
  margin-top: 30px;
}
/* #videoUpload .fileArea{
              position: relative;
          } */
#videoUpload .chooseVideo {
  position: absolute;
  left: 110%;
}
#videoUpload .choosePic,
#videoUpload .startUpload {
  position: absolute;
  left: 110%;
}
.submit {
  top: 30px;
}
#videoUpload .start {
  margin: 0;
}
#videoUpload #resultBox {
  margin-left: 30px;
  box-sizing: border-box;
  width: 400px;
  height: 300px;
  border: 1px solid #e6ebf5;
  padding: 5px;
  overflow: auto;
  margin-bottom: 20px;
}
#videoUpload .uploaderMsgBox {
  width: 100%;
  border-bottom: 1px solid #888;
}
#videoUpload [act="cancel-upload"] {
  text-decoration: none;
  cursor: pointer;
}
#videoUpload .btn-outline {
  color: #563d7c;
  background-color: transparent;
  border-color: #563d7c;
}
#videoUpload #changeCover {
  margin-left: 10px;
}
#videoUpload .btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border-radius: 4px;
  border: 1px solid;
}
#videoUpload .btn:hover {
  background: #eb9e05;
  color: #ffffff;
}
#videoUpload a {
  text-decoration: none;
}
#videoUpload .col-sm-1 {
  color: #5a5e66;
}
#videoUpload .col-sm-4 {
  margin: 10px 0;
}
#videoUpload .videoArea {
  position: relative;
}
#videoUpload .el-form-item__label[for="videoFile"]::before {
  content: "*";
  color: #fa5555;
  margin-right: 4px;
}
#videoUpload .el-form-item__label[for="picFile"]::before {
  content: "*";
  color: #fa5555;
  margin-right: 4px;
}
/* 视频列表样式 */
#videoUpload {
  padding: 0 30px;
}
#videoUpload #course_list {
  padding: 0;
  background-color: #fff;
  margin-top: 0;
  -webkit-margin-after: 0em;
}
#videoUpload .el-form {
  text-align: left;
  padding: 10px 20px 0 20px;
  margin-top: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
}
#videoUpload #course_list li {
  position: relative;
  list-style-type: none;
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}
#videoUpload .el-form-item {
  margin-bottom: 10px;
}
#videoUpload #course_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  cursor: pointer;
}
#videoUpload #course_list .content {
  text-align: left;
  vertical-align: center;
  margin-left: 230px;
  margin-right: 200px;
  height: 150px;
  overflow: hidden;
}
#videoUpload #course_list .content h2 {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#videoUpload #course_list .content .info {
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
#videoUpload #course_list .content .author,
#videoUpload #course_list .content .create-time {
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
#videoUpload .course-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#videoUpload #course_list .content .handle {
  position: absolute;
  color: #5a5e66;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
#videoUpload .btn-select {
  margin: 5px 0;
}
#videoUpload #course_list .content .tag {
  height: 40px;
  line-height: 40px;
}
#videoUpload .el-dialog__body {
  padding: 0;
}
#videoUpload .toolbar {
  background-color: #fff;
  height: 60px;
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 15px;
}
</style>