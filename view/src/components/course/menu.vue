<template>
  <div id="videoVideoList">
    <div class="menu-title">
        <div class="class-name">课程名：{{class_title}}</div>
    </div>
    <div class="add-class-box">
        <el-button type="success" @click="toUploadVideo" class="add-class">添加目录</el-button>
    </div>
    <!--视频列表-->
    <div class="noting" v-if="this.pages==[]||this.pages==null||this.pages==''">
      暂无数据
    </div>
    <div v-else class="padding30">
      <ul id="video_list">
        <li v-for="item in pages" :key="item.id">
          <div class="page_item">
            <div class="pic">
              <img class="img" :src="item.cover_pic" alt="转码中">
            </div>
            <div class="content">
              <h2 class="title-h2" @click="toDetail(item.id)">{{item.title}}</h2>
              <div class="author">
                <span class="author">是否试听：{{item.audition=='no'?'否':(item.audition=='yes'?'是':'')}}</span>
              </div>
              <div class="create_time">
                <!-- <span class="create_time">备注：{{item.desc}}</span> -->
              </div>
              <div :title="item.abstract" class="abstract">简介：{{item.desc}}</div>
              <div class="btn-box">
                <button class="refresh"  @click="refresh(item.fileid)" >刷新</button>
                <button class="edit"  @click="edit(item.id)" >编辑</button>
                <button class="delete"  @click="deleted(item.id)" >删除</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
#videoVideoList {
  background-color: #fff;
  margin-top: 10px;
}
.class-name {
  padding: 20px 30px;
  font-weight: 700;
}
.add-class-box {
    padding-left: 30px;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 20px
}
#video_list {
  padding-top: 10px;
  background: #fff;
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  -webkit-padding-start: 0px;
  padding-left: 10px;
}
#video_list li {
  position: relative;
  list-style-type: none;
  padding: 10px 0 20px 0;
  border-bottom: 1px solid #edf2fc;
  clear: both;
  overflow: hidden;
  height: 160px;
  box-sizing: border-box;
}
#video_list .pic {
  float: left;
  height: 130px;
  line-height: 130px;
  text-align: center;
  vertical-align: middle;
  width: 160px;
  border: 1px solid #edf2fc;
  border-radius: 0 0;
  overflow: hidden;
  /* margin-top: 50%; */
  margin-top: 0;
  margin-left: 20px;
}
#video_list .pic img {
  height: 130px;
  width: 160px;
}
#video_list .content {
  text-align: left;
  margin-left: 210px;
  margin-right: 200px;
  overflow: hidden;
}
#videoVideoList #video_list .content .abstract {
  /* position: absolute; */
  font-size: 12px;
  color: #5a5e66;
  overflow: hidden;
  margin-top: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#videoVideoList #video_list .content .author,
#videoVideoList #video_list .content .create_time {
  /* position: absolute; */
  margin-top: 5px;
  color: #5a5e66;
  font-size: 12px;
  margin-right: 40px;
}
#video_list .content .title-h2 {
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  height: 16px;
  line-height: 0;
  color: #5a5e66;
}
#video_list .content .title-h2:hover {
  color: #ee2c2c;
}
#video_list .btn-box {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
#video_list .refresh,
#video_list .edit,
.delete {
  display: block;
  color: #fff;
  padding: 5px 15px;
  border-radius: 3px;
  float: left;
  margin-right: 5px;
  /* outline: none; */
  font-size: 12px;
  cursor: pointer;
}
#video_list .refresh {
  background-color: #409eff;
  border: 1px solid #409eff;
}
#video_list .refresh:hover {
  background-color: #67a8e9;
  border: 1px solid #67a8e9;
}
#video_list .edit {
  background-color: #67c23a;
  border: 1px solid #67c23a;
}
#video_list .edit:hover {
  background-color: #73b651;
  border: 1px solid #73b651;
}
.delete {
  background-color: #f56c6c;
  border: 1px solid #f56c6c;
}
.delete:hover {
  background-color: #d36f6f;
  border: 1px solid #d36f6f;
}
</style>
<script>
import Api from "../../api";
export default {
  data() {
    return {
      pages: [],
      scrollPos: 0,
      class_id: "",
      class_title: ""
    };
  },
  created() {
    this.class_id = this.$route.query.id ? this.$route.query.id : "";
    this.getClassMenu();
    let that = this;
    setTimeout(() => {
      document.getElementsByClassName("content-container")[0].onscroll = e => {
        that.scrollPos = e.target.scrollTop;
      };
    });
  },
  activated() {
    this.getClassMenu();
  },
  methods: {
    // 刷新数据，看视频是否转码成功
    refresh(id) {
      this.getClassMenu(id);
    },
    getClassMenu(id) {
      var data = Object.assign({}, this.query);
      if (id) {
        this.$set(data, "fileid_sync", id);
        Api.video.getqcinfo({ fileid: id }).then(res => {
          Api.video
            .video_list(data)
            .then(response => {
                Api.course.details(this.class_id).then(res => {
                    this.pages = res.data.catalogs;
                    this.total_rows = res.data.catalogs.length;
                    this.class_title = res.data.title;
                });
            })
            .catch(response => {
              this.$message.error("错了哦，这是一条错误消息");
            });
        });
      }
      Api.course.details(this.class_id).then(res => {
        this.pages = res.data.catalogs;
        this.total_rows = res.data.catalogs.length;
        this.class_title = res.data.title;
      });
    },
    toUploadVideo() {
      this.$router.push({
        path: "../videoUpload/upload",
        query: {
          class_id: this.class_id
        }
      });
    },
    toDetail(id) {
      this.$router.push({
        path: "/videoUpload/videoDetail",
        query: {
          id: id,
          pos: this.scrollPos || 0
        }
      });
    },
    edit(id) {
      this.$router.push({
        path: "/videoUpload/videoEdit",
        query: {
          id: id,
          pos: this.scrollPos || 0
        }
      });
    },
    deleted(id) {
      Api.video.deleted_catalogs(id).then(res => {
        this.$message.success("删除成功！");
        this.getClassMenu();
      });
    },
  }
};
</script>
