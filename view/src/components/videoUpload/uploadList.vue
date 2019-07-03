<template>
  <div id="videoVideoList">
    <!-- 视频发布 -->
    <el-form :inline="true" :model="query" class="demo-form-inline" ref="publishForm">
      <el-form-item>
        <el-input v-model="query.search" placeholder="标题" @keyup.enter.native="send_query"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="send_query" class="search">搜索</el-button>
      </el-form-item>
    </el-form>
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
                <span class="author">类型：{{item.audition=='no'?'':(item.audition=='yes'?'试听':'')}}</span>
              </div>
              <div class="create_time">
                <span class="create_time">创建时间：{{item.created}}</span>
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
    <!--底部分页-->
    <el-col :span="24" class="toolbar padding30">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page" :page-size="query.count" layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
      </el-pagination>
    </el-col>
  </div>
</template>

<style>
  #videoVideoList {
    background-color: #fff;
  }
  #videoVideoList .demo-form-inline {
    position: relative;
    background: #eef1f6;
    padding: 40px 0 20px 30px
  }
  #videoVideoList .el-form {
    padding: 10px 10px 0 30px;
    background-color: #ffffff;
    margin-top: 10px;
    border-bottom: 1px solid #f2f2f2;
  }
  #videoVideoList .search {
    position: absolute;
    right: -94px;
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
    border-bottom: 1px solid #EDF2FC;
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
    border: 1px solid #EDF2FC;
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
    margin-right: 150px;
    overflow: hidden;
  }
  #videoVideoList #video_list .content .abstract {
    /* position: absolute; */
    font-size: 12px;
    color: #5A5E66;
    overflow: hidden;
    margin-top: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #videoVideoList #video_list .content .author,
  #videoVideoList #video_list .content .create_time {
    /* position: absolute; */
    margin-top: 5px;
    color: #5A5E66;
    font-size: 12px;
    margin-right: 40px;
  }
  #video_list .content .title-h2 {
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    height: 16px;
    line-height: 0;
    color: #5A5E66;
  }
  #video_list .content .title-h2:hover {
    color: #EE2C2C;
  }
  #video_list .btn-box {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  #video_list .refresh, #video_list .edit, .delete {
    display: block;
    color: #fff;
    padding: 5px 15px;
    border-radius: 3px;
    outline: none;
    font-size: 12px
  }
  #video_list .refresh {
    background-color: #409eff;
    border: 1px solid #409eff
  }
  #video_list .edit {
    margin-top: 5px;
    background-color: #67c23a;
    border: 1px solid #67c23a
  }
  .delete {
    margin-top: 5px;
    background-color: #f56c6c;
    border: 1px solid #f56c6c
  }
  #videoVideoList .toolbar {
    background-color: #fff;
    padding-bottom: 10px;
    margin-top: 10px
  }
</style>
<script>
  import Api from "../../api";
  export default {
    data() {
      return {
        pages: [],
        // 二级联动
        query: {
          page: 1,
          count: 10,
          search: null,
        },
        total_rows: 0,
        scrollPos: 0,
      };
    },
    created() {
      this.getPages();
      let that = this;
      setTimeout(() => {
        document.getElementsByClassName('content-container')[0].onscroll = (e) => {
          that.scrollPos = e.target.scrollTop;
        };
      })
    },
    activated() {
      this.getPages();
    },
    methods: {
      // 刷新数据，看视频是否转码成功
      refresh(id) {
        this.getPages(id)
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
        Api.video.deleted_catalogs(id)
        .then(res =>{
          this.$message.success("删除成功！")
          this.getPages()
        })
      },
      //搜索
      send_query() {
        this.getPages();
      },
      //获取视频列表
      getPages(id) {
        var data = Object.assign({}, this.query);
        if (id) {
          this.$set(data, 'fileid_sync', id)
          Api.video.getqcinfo({fileid:id})
          .then(res =>{
            console.log(res)
          })
        }

        Api.video.video_list(data)
          .then(response => {
            this.pages = response.data;
            this.total_rows = response.total;
            for (var i = 0; i < response.data.length; i++) {
              let obj = response.data[i];
              let time = new Date(obj.created)
              let year = time.getFullYear()
              let month = time.getMonth() + 1
              let day = time.getDate()
              this.pages[i].created = `${year}年${month}月${day}日`
            }
          })
          .catch(response => {
            this.$message.error("错了哦，这是一条错误消息");
          });
      },
      //分页
      handleCurrentChange(val) {
        this.query.page = val;
        this.getPages();
      },
      handleSizeChange(val) {
        this.query.page = 1;
        this.query.count = val;
        this.getPages();
      }
    }
  };
</script>
