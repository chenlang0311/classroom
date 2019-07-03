<template>
  <div id="courseUpdate-container">
    <div class="left">
      <el-form :rules="rules" :model="form" ref="form" label-width="80px" id="demo-dynamic">
        <el-form-item class="courseUpdate" prop="title" label="课程标题" label-width="90px">
          <el-input type="textarea" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="原价" label-width="80px" prop="original_price">
          <el-input v-model.number="form.original_price"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="现价" label-width="80px" prop="price">
          <el-input v-model.number="form.price"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="分类" label-width="80px">
          <el-select v-model="form.channel" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.lable" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="courseUpdate" label="栏目" label-width="80px">
          <el-select v-model="form.category_id" placeholder="请选择">
            <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="courseUpdate" label="作者" label-width="80px">
          <el-input v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="作者简介" label-width="80px">
          <el-input v-model="form.author_abstract"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="课堂简介" label-width="80px">
          <el-input type="textarea" v-model="form.abstract"></el-input>
        </el-form-item>
        <el-form-item class="courseUpdate" label="备注" label-width="80px">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="上传课程封面图(建议尺寸 628*596)" class="pic" prop="pic">
          <el-upload name="uploadimg" class="avatar-uploader" :action="upload_way + '/uploads/uploadimg'" :headers="headInfo" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <button class="save_button" @click="save_editor()">保存</button>
    </div>
    <div class="editor-container">
      <div class="editor-title">课程详情</div>
      <script id="container" type="text/plain">

      </script>
      <v-ue :defaultMsg=defaultMsg :config=config ref="ue" style="max-width: 100%!important"></v-ue>
    </div>
  </div>
</template>
<style>
#courseUpdate-container {
  margin-top: 10px;
  display: flex;
  min-height: 600px;
  background-color: #f2f2f2;
}
#courseUpdate-container .editor-title {
  height: 40px;
  margin-left: 20px;
  font-size: 14px;
  color: #5a5e66;
  line-height: 40px;
}
#courseUpdate-container .edui-editor {
  width: 700px;
  overflow: hidden;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 13px;
  box-sizing: border-box;
}
#courseUpdate-container .left {
  /* width: 400px; */
  flex: 1;
  margin-right: 10px;
  background: #fff;
  padding: 20px;
  box-shadow: 2px 2px 2px #dfe4ed;
}
#courseUpdate-container .editor-container {
  flex: 3;
  padding-top: 20px;
  background: #fff;
  box-shadow: 2px 2px 2px #dfe4ed;
}

#courseUpdate-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
#courseUpdate-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
#courseUpdate-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
#courseUpdate-container .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import Ue from "../../assets/ue.vue";
import Api from "../../api";
//引入配置的图片测试环境下的路径
import config from "../../config";
export default {
  components: {
    "v-ue": Ue
  },
  data() {
    return {
      category: [],
      options: [
        {
          lable: "音频",
          value: "audio"
        },
        {
          lable: "视频",
          value: "video"
        }
      ],
      //上传文章封面图片你的路径
      upload_way: "",
      headInfo: {
        Authorization: ""
      },
      imageUrl: "",
      pic: "",
      id: "",
      form: {},
      page: {
        id: ""
      },
      created: null,
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 500
      },
      add: {
        title: null,
        author: null,
        abstract: null,
        content: null,
        user_id: null,
        cover_pic: []
      },
      update: {
        title: null,
        author: null,
        abstract: null,
        content: null,
        user_id: null,
        cover_pic: []
      },
      rules: {
        title: [
          {
            required: true,
            message: "请选择输入标题",
            trigger: "blur"
          }
        ],
        original_price: [
          {
            required: true,
            type: "number",
            message: "请输入价格",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            type: "number",
            message: "请输入价格",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.id = this.$route.query ? this.$route.query.id : "";
    this.getCategory();
    this.getCourseInfo();
  },
  mounted() {
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
  },
  methods: {
    //请求课程分类列表
    getCategory() {
      Api.course.category_list().then(res => {
        this.category = res.data;
      });
    },
    //上传图片
    handleAvatarSuccess(res, file) {
      this.pic = res.data.name;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJpgOrPng =
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/webp" ||
        file.type == "image/bmp";
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isJpgOrPng) {
        this.$message.error("上传图片只能是jpg、png、webp或者BMP格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isJpgOrPng && isLt10M;
    },
    //获取编辑器中编辑的内容
    getUEContent() {
      let content2 = this.$refs.ue.getUEContent();
      return content2;
    },
    //获取文章具体内容
    getCourseInfo() {
      Api.course
        .details(this.id)
        .then(data => {
          let res = data.data;
          let arr = [];
          arr.push(res.cover_pic);
          this.form = res;
          this.form.title = res.title;
          this.form.original_price = parseFloat(res.original_price) / 100;
          this.form.price = parseFloat(res.price) / 100;
          this.form.channel = res.channel;
          this.form.author = res.author;
          this.form.author_abstract = res.author_abstract;
          this.form.abstract = res.abstract;
          this.form.channel = res.channel;
          this.form.desc = res.desc;
          this.defaultMsg = res.details.content;
          if (!res.cover_pic) res.cover_pic = [];
          this.pic = res.cover_pic;
          this.imageUrl = res.cover_pic
        })
        .catch(res => {});
    },
    //提交保存编辑好的文章
    save_editor() {
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        const content = this.getUEContent();
        this.update.title = this.form.title;
        this.update.original_price = parseFloat(this.form.original_price) * 100;
        this.update.price = parseFloat(this.form.price) * 100;
        this.update.channel = this.form.channel;
        this.update.author = this.form.author;
        this.update.author_abstract = this.form.author_abstract;
        this.update.abstract = this.form.abstract;
        this.update.desc = this.form.desc;
        this.update.content = content;
        let picArr = []
        picArr.push(this.pic)
        this.update.cover_pic = picArr;
        if (this.update.title) {
          Api.course.class_update(this.id, this.update).then(data => {
            if (data.status) {
              this.$message.success("保存成功！");
              this.$router.push({
                path: "/course/courseList"
              });
            }
          });
        } else {
          this.$message.error("保存失败");
        }
      });
    } //save_editor
  } //mounted
};
</script>

<style scopedSlots>
p {
  margin: 0 0;
}
#courseUpdate-container .save_button {
  background-color: #20a0ff;
  border: none;
  height: 30px;
  width: 70px;
  cursor: pointer;
  margin-top: 10px;
  float: left;
  border-radius: 3px;
  color: #fff;
}
</style>