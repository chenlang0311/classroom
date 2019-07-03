// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
// Vue.use(router)

//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//引入Ueditor富文本编辑器相关内容
import '../static/Ueditor/ueditor.config.js'
// import '../static/Ueditor/ueditor.all.min.js'
import '../static/Ueditor/ueditor.all.js'
import '../static/Ueditor/lang/zh-cn/zh-cn.js'
import '../static/Ueditor/ueditor.parse.min.js'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app');
