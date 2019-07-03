<template>
  <div id="pictureList">
    <div class="contianer">
      <!-- 列表头部栏 -->
      <div class="banner padding30">
        <div class="pic">
          图片
        </div>
        <div class="content">
          图片信息
        </div>
        <div class="priority">
          图片优先级
        </div>
        <div class="handle">
          操作
        </div>
      </div>
      <!--文章列表-->
      <div class="noting" v-if="this.pages==[]||this.pages==null||this.pages==''">
        暂无数据
      </div>
      <div class="" v-else>
        <ul id="pic_list" class="padding30">
          <li v-for="item in pages" :key="item.id">
            <div class="page_item">
              <div class="pic">
                <img :src="item.pic" style="width: 180px; height: 130px" alt="">
              </div>
              <div class="content">
                <div class="abstract">轮播图标题：{{item.title}}</div>
                <div class="category">
                  课程名称：{{item.class_name}}
                </div>
              </div>
              <div class="priority">
                <el-input-number size="mini" v-model="item.level" controls-position="right" @change="(value) => changeHandler(value, item.id)" :min="1" :max="99"></el-input-number>
              </div>
              <div class="handle">
                <p class="edit" @click="delate(item.id)" style="color: #000">
                  <!-- <span>删除</span> -->
                  <el-button type="danger">删除</el-button>
                </p>

              </div>

            </div>
          </li>
        </ul>
      </div>


      <!--底部分页-->
      <el-col :span="24" class="toolbar padding30">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page" :page-size="query.count"
          layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
        </el-pagination>
      </el-col>
    </div>
  </div>


</template>

<style scoped>
/* 列表头部栏 */
#pictureList {
  box-shadow: 2px 2px 2px #dfe4ed;
}
#pictureList .contianer {
  border-bottom: 1px solid #f2f2f2;
}
#pictureList .banner {
  position: relative;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  margin-top: 10px;
  line-height: 30px;
}
#pictureList .banner .pic {
  float: left;
  margin-left: 70px;
  margin-top: 15px;
}

#pictureList .banner .content {
  position: absolute;
  left: 350px; 
  top: 15px;
}

#pictureList .banner .priority {
  position: absolute;
  top: 15px;
  right: 150px;
}

#pictureList .banner .handle {
  position: absolute;
  top: 15px;
  right: 40px;
}
/* 文章列表 */

#pictureList .demo-form-inline {
  margin-top: 20px;
}

#pictureList #pic_list {
  margin-top: 0;
  padding: 0 30px;
  background-color: #fff;
  -webkit-margin-after: 0em;
}

#pictureList #pic_list li {
  position: relative;
  list-style-type: none;
  /* background-color: pink; */
  /* padding: 10px 0 20px 0; */
  height: 150px;
  border-bottom: 1px solid #f7f7f7;
  clear: both;
  overflow: hidden;
}

#pictureList #pic_list .pic {
  float: left;
  height: 120px;
  width: 180px;
  margin-top: 10px;
  margin-left: 20px;
  /* vertical-align: center; */
  /* background-color: #393; */
}

#pictureList #pic_list .content {
  text-align: left;
  margin-left: 230px;
  margin-right: 260px;
  /* height: 120px; */
  /* background-color: red; */
  overflow: hidden;
}

#pictureList #pic_list .content .abstract {
  font-size: 16px;
  font-weight: 700;
  color:#5A5E66;
  /* margin-left: -5px; */
  margin-top: 30px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

#pictureList #pic_list .content .category {
  color:#5A5E66;
  font-size: 12px;
}

#pictureList #pic_list .content .category .create_time {
  line-height: 19px;
  /* position: absolute; */
  margin-left: 10px;
}

#pictureList #pic_list .priority {
  position: absolute;
  right: 100px;
  top: 0;
  width: 150px;
  /* height: 120px;
   */
  top: 40%;
  /* background-color: #ceb; */
}

#pictureList #pic_list .handle {
  position: absolute;
  right: 0;
  width: 100px;
  /* height: 120px; */
  /* background-color: #ccc; */
  top: 50%;
  transform: translateY(-50%);
}

#pictureList #pic_list .handle  span:hover {
  color: red;
  cursor: pointer;
}
/* 分页 */

#pictureList .toolbar {
  /* margin-top: 20px; */
  background-color: #fff;
  height: 60px; 
  margin-top: 10px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
<script>
import axios from 'axios'
import Api from "../../api";
export default {
  data() {
    return {
      pages: [],
      // 二级联动
      query: {
        page: 1,
        count: 10,
        search: null
      },
      level:{
        level:''
      },
      total_rows: 0
    };
  },
  created() {

    this.getImage();
  },
  activated() {
    this.getImage();
  },
  methods: {
    toDetail(id) {
      this.$router.push({
        path: "/article/articleDetail",
        query: {
          id: id
        }
      });
    },

    //删除图片
    delate(id) {
      Api.course.pic_deleted(id).then(res => {
          this.$message.success("删除成功！");
          this.getImage();
        
      });
    },
    //搜索
    send_query() {
      this.getImage();
    },
    //优先级改变值
    changeHandler(value,id) {
      this.level.level = value
      Api.course.update_level(id,this.level).then(res => {
          this.$message.success("修改优先级成功！");
          this.getImage();
        
      });
    },
    //获取图片列表
    getImage() {
      Api.course
        .pic_list(this.query)
        .then(response => {
          this.pages = response.data;
          this.total_rows = response.total;
          for (var i = 0; i < response.data.length; i++) {
            let obj = response.data[i];
            let time = new Date(obj.created);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time.getDate();
            this.pages[i].created = `${year}年${month}月${day}日`;
            //将分类换成中文
            if (obj.category == "pages") {
              this.pages[i].category = "文章";
            }
            if (obj.category == "videos") {
              this.pages[i].category = "视频";
            }
          }
        })
        .catch(response => {
          this.$message.error("错了哦，这是一条错误消息");
        });
    },
    //分页
    handleCurrentChange(val) {
      this.query.page = val;
      this.getImage();
    },
    handleSizeChange(val) {
      this.query.page = 1;
      this.query.count = val;
      this.getImage();
    }
  }
};
</script>

<style scoped>

</style>
