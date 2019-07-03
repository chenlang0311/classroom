<template>
  <div class="course-Info">
    <div class="course-title-box">
      <div class="course-title">
        <div class="course-title-cover">
          <div class="cover-pic">
            <img class="img" :src="courseInfo.cover_pic" alt="">
          </div>
        </div>
        <div class="course-title-right">
          <div class="course-name">{{courseInfo.title}}</div>
          <div class="price-box">
            <div class="original_price">原价：{{parseFloat(courseInfo.original_price)/100}}元</div>
            
            <div class="price">现价：{{parseFloat(courseInfo.price)/100}}元</div>
          </div>
          <div class="people-num">已有{{courseInfo.unlocks}}人购买</div>
        </div>
      </div>
    </div>
    <div class="course-Info-mian">
      <div class="info-mian-left">
        <el-tabs v-model="activeName">
          <el-tab-pane label="详情" name="first">
            <div class="tab1" v-html="courseInfo.details?courseInfo.details.content:''"></div>
          </el-tab-pane>
          <el-tab-pane label="目录" name="second">
            <div class="noting" v-if="courseInfo.catalogs.length==0">暂无目录</div>
            <el-collapse accordion>
              <el-collapse-item v-for="(item,index) in courseInfo.catalogs" :key="index">
                <template slot="title">
                    <div class="tab3">
                        <div class="tab3-title">{{item.title}}
                        </div>
                        <div class="tab3-left-bottom">
                            <div class="tab2-left-bottom-1">
                              {{item.duration}}
                            </div>
                            <div class="tab2-left-bottom-1">
                              {{item.reads}}次学习
                            </div>
                            <div class="tab2-left-bottom-3" v-if="item.audition=='yes'">
                              {{item.audition=='no'?'':(item.audition=='yes'?'试听':'')}}
                            </div>
                        </div>
                    </div>
</template>
                <div class="catalogs-content" v-html="item.content"></div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="info-mian-right">
        <div class="author-info">
          <div class="author-pic">
            <img class="author-pic-img" :src="courseInfo.cover_pic" alt="">
          </div>
          <div class="author-info-right">
            <div class="author-info-name">{{courseInfo.author}}</div>
            <div class="author-info-r-bott"></div>
          </div>
        </div>
        <div class="author-desc">
          {{courseInfo.author_abstract}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from "../../api";
  import axios from "axios";
  export default {
    data() {
      return {
        activeName: "first",
        tab: false,
        active2: null,
        courseInfo: {
          details: {},
          author: "",
          author_abstract: "",
          img: "",
          title: "",
          original_price: "",
          price: "",
          unlocks: "",
          content: "",
          catalogs: [],
          id: "",
          lock: true,
        }
      };
    },
    created() {
      this.id = this.$route.query ? this.$route.query.id : "";
      this.getCourseInfo();
    },
    mounted() {},
    methods: {
      active(index) {
        if (this.lock) {
          this.active2 = '';
          this.lock = false;
        } else {
          this.active2 = index;
          this.lock = true;
        }
      },
      getCourseInfo() {
        let that = this;
        Api.course.details(that.id).then(res => {
          res.data.catalogs.map(item => {
            let h = Math.floor(item.duration / 3600);
            let m = Math.floor((item.duration / 60) % 60);
            let s = Math.floor(item.duration % 60);
            if (h > 0) {
              item.duration = h + ":" + m + ":" + s
            } else {
              item.duration = m + ":" + s
            }
            return item
          });
          that.courseInfo = res.data;
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .catalogs-content {
    padding: 13px;
    border-radius: 5px;
    border: 1px solid #f2f2f2;
    color: #2c3e50
  }
  .tab1 {
    font-size: 13px;
    color: #2c3e50;
    line-height: 24px;
  }
  .el-collapse-item__header {
    height: 50px!important;
    line-height: 15px!important;
  }
  .tab3-title {
    margin-top: 10px
  }
  .tab3-left-bottom {
    margin-top: 10px;
    font-size: 12px
  }
  .el-tabs__nav-scroll {
    height: 60px;
    line-height: 60px;
  }
  .el-tabs__item {
    font-size: 20px;
  }
  .tab2-left-bottom-1,
  .tab2-left-bottom-3 {
    display: inline-block;
    margin-right: 10px
  }
  .tab2-left-bottom-3 {
    background-color: #f56c6c;
    color: #fff;
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 3px;
    border: #f56c6c
  }
</style>

<style scoped>
  .course-title-box {
    width: 100%;
    background-color: #fff;
  }
  .course-title {
    width: 1000px;
    margin: 0 auto;
    display: flex;
    background-color: #fff;
    padding: 20px;
    border-bottom: #f2f2f2;
  }
  .course-title-cover {
    /* width: 300px */
  }
  .cover-pic {
    height: 150px;
    width: 250px;
  }
  .course-Info .img {
    height: 100%;
    width: 100%;
  }
  .course-title-right {
    flex: 1;
    padding-left: 40px;
  }
  .course-name {
    font-size: 24px;
    font-weight: 600;
  }
  .price-box {
    margin-top: 20px;
  }
  .original_price,
  .price {
    display: inline-block;
    margin-right: 20px;
  }
  .original_price {
    text-decoration: line-through 
  }
  .people-num {
    margin-top: 10px;
  }
  .course-Info-mian {
    padding-top: 10px;
    background-color: #f2f2f2;
    clear: both;
    overflow: hidden;
    width: 1000px;
    /* height: 800px; */
    margin: 0 auto;
  }
  .info-mian-left {
    width: 690px;
    background-color: #fff;
    margin-bottom: 20px;
    /* height: 800px; */
    float: left;
    padding: 20px;
    box-sizing: border-box;
  }
  .info-mian-left .tab2 {
    display: flex;
    margin: 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .tab2-left {
    flex: 10;
  }
  .tab2-left-bottom {
    margin: 5px 0;
    font-size: 12px;
    color: #aaa;
  }
  .tab2-right {
    flex: 1;
  }
  .info-mian-right {
    padding: 20px;
    box-sizing: border-box;
    width: 290px;
    /* height: 400px; */
    background-color: rgb(256, 256, 256);
    float: right;
  }
  .author-info {
    display: flex;
  }
  .author-pic {
    flex: 2;
  }
  .author-info-right {
    flex: 4;
  }
  .author-pic-img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
  }
  .author-desc {
    color: #2c3e50;
    margin-top: 20px;
    font-size: 13px;
    line-height: 20px;
  }
</style>
