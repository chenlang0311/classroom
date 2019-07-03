<template>
  <div>
    <script :id="container" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'U',
    data() {
      return {
        editor: null,
        container: 'editor_' + Math.random()*Math.random
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    watch: {
      // 监听初始化动态数据，重新渲染编辑器内部内容
      defaultMsg: function (newDefaultMsg,old) {
        var _this = this;
        //这个ready函数非常关键 不然在进入到编辑页面之后再刷会报错！！！！！！！！！！！！！！！！！！！！！！！！！
        this.editor.ready(function () {
          _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        });
      }
         
    },
    mounted() {
      const _this = this;
      this.editor = UE.getEditor('container', this.config); // 初始化UE
      this.editor.ready(function () {
        _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
      });
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent();
      }
    },
    destroyed() {
      // alert('被销毁');
      this.editor.destroy();
    }
  }
</script>