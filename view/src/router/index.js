import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'

// 登陆组件
import Login from '../components/user/login'
// 首页组件
import Home from '../components/home'
// 轮播图组件
import PicturePictureList from '../components/picture/pictureList'
import PicturePictureAdd from '../components/picture/pictureAdd'
// 课程组件
import createCourse from '../components/course/createCourse'
import courseList from '../components/course/courseList'
import courseInfo from '../components/course/courseInfo'
import courseUpdate from '../components/course/courseUpdate'
// import ordersList from '../components/course/ordersList'
import menu from '../components/course/menu'

// 订单列表
import ordersList from '../components/orders/ordersList'

//上传视频
import upload from '../components/videoUpload/upload'
import uploadList from '../components/videoUpload/uploadList'
import videoDetail from '../components/videoUpload/videoDetail'
import videoEdit from '../components/videoUpload/videoEdit'

//404组件
import No from '../components/404'

Vue.use(Router)

const routes = [
  // 默认路由 默认显示Home组件 通过路由重定向同时默认路由跳转至图片管理
  {
    path: '/',
    redirect: '/picture'
    // component:Home
  },
  {
    path: '/404',
    component: No
  },
  {
    path: '/login',
    component: Login
  },
  // 图片管理
  {
    path: '/picture',
    descript: '轮播图管理',
    component: Home,
    show: 'true',
    icon: 'el-icon-picture',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      routerName:'轮播图管理'
    },
    children: [
      // 默认路由 路由为图片管理的时候默认跳转至图片列表
      {
        path: '/',
        redirect: '/picture/pictureList'
      },
      {
        path: '/picture/pictureAdd',
        component: PicturePictureAdd,
        name: '上传轮播图',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'上传轮播图',
          keepAlive: true,
        },
        show: 'true'
      },
      {
        path: '/picture/pictureList',
        component: PicturePictureList,
        name: '轮播图列表',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'轮播图列表',
          keepAlive: true,
        },
        show: 'true'
      }
    ]
  },
  // 课程管理
  {
    path: '/course',
    descript: '课程管理',
    component: Home,
    show: 'true',
    icon: 'el-icon-tickets',
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      routerName:'课程管理'
    },
    children: [
      // 默认路由
      {
        path: '/',
        redirect: '/course/courseList'
      },
      {
        path: '/course/createCourse',
        component: createCourse,
        name: '创建课程',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'创建课程',
          keepAlive: true,
        },
        show: 'true'
      },
      {
        path: '/course/courseList',
        component: courseList,
        name: '课程列表',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'课程列表',
          keepAlive: true,
        },
        show: 'true'
      },
      {
        path: '/course/menu',
        component: menu,
        name: '目录管理',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'目录管理',
          keepAlive: true,
        }
      },
      {
        path: '/course/courseUpdate',
        component: courseUpdate,
        name: '修改课程',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'修改课程',
          keepAlive: true,
        }
      },
      {
        path: '/course/courseInfo',
        component: courseInfo,
        name: '课程详情',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          routerName:'课程详情',
          keepAlive: true,
        }
      }
    ]
  },
    // 订单管理
    {
      path: '/course',
      descript: '订单管理',
      component: Home,
      show: 'true',
      icon: 'el-icon-document',
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        routerName:'订单管理'
      },
      children: [
        //设置默认路由
        {
          path: '/',
          redirect: '/orders/ordersList'
        },
        {
          path: '/orders/ordersList',
          component: ordersList,
          name: '订单列表',
          show: 'true',
          meta: {
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            routerName:'订单列表',
            keepAlive: true,
          }
        },
      ]
    },
  //添加目录
  {
    path: '/videoUpload',
    component: Home,
    descript: '目录管理',
    show: false,
    icon:'el-icon-view',
    meta: {
      routerName:'目录管理',
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      //设置默认路由
      {
        path: '/',
        redirect: '/videoUpload/uploadList'
      },
      {
        path: '/videoUpload/upload',
        component: upload,
        name: '添加目录',
        show: 'true',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          keepAlive: true,
        }
      },
      // {
      //   path: '/videoUpload/uploadList',
      //   component: uploadList,
      //   name: '视频列表',
      //   show: 'true',
      //   meta: {
      //     requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      //     keepAlive: true, //此组件需要被缓存
      //   }
      // },
      {
        path: '/videoUpload/videoEdit',
        component: videoEdit,
        name: '目录编辑',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        }
      },{
        path: '/videoUpload/videoDetail',
        component: videoDetail,
        name: '目录详情',
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        }
      },
    ],
  }

]

const router = new Router({
  routes,
  scrollBehavior(to, from, savedPosition) {
		if(from.query.pos){
			document.getElementsByClassName('content-container')[0].scrollTop = from.query.pos;
		}
	},
})

// 利用vue-router提供的钩子函数beforeEach()对路由进行判断。
router.beforeEach((to, from, next) => {
  //如果输入错误的地址就进入404页面
  if (to.matched.length == 0) {
    next({
      path: '/404'
    })
    return
  }
  //地址正确了才会进行下面的验证s
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    // typeof localStorage.getItem('token') => 存在token键就是string，不存在token键就是object 
    if (localStorage.getItem('token') != '' && localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) { // 通过vuex state获取当前的token是否存在
      // alert(1);
      next();
    } else {
      next({
        path: '/login',
        // 将跳转的路由path作为参数，登录成功后跳转到该路由  也就是说登录成功之后可以根据query中的内容跳转回原来的路由(页面)
        //其实实际不会这样子，因为在点击登陆按钮的时候会设置一个跳转到的目标路由
        //会先跳转到下面这个fullpath路由，然后跳转到登陆里面设置的目标路由，
        //页面效果就看不见这个fullpath路由显示的页面
        query: {
          redirect: to.path
        }
      })
    }
  } else {
    next();
  }
})


// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  err => {
    console.log(err);
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(response => {
  if (response && response.data) {
    if (response.data.status === true) {
      return response.data;
    } else {
      if (response.data.code === 1101) {
        Vue.prototype.$message.error(response.data.msg ? response.data.msg : '请求出错');
        router.push({
          path: "/login"
        });
      } else {
        Vue.prototype.$message.error(response.data.msg ? response.data.msg : '请求出错');
      }

      return Promise.reject(response.data);
    }
  }

  Vue.prototype.$message.error('未知错误');
  return Promise.reject(null);
}, error => {
  Vue.prototype.$message.error('未知错误');
  return Promise.reject(error.response.data)
});


Vue.prototype.goBack = function () {
  router.go(-1)
}

export default router
