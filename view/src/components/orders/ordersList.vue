<template>
    <div class="orderList">
        <el-form :inline="true" :model="query" class="demo-form-inline" ref="publishForm">
            <el-form-item>
                <el-input v-model="query.search" placeholder="昵称/课程名/订单号" @keyup.enter.native="send_query"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="send_query">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="noting" v-if="this.orderList==[]||this.orderList==null||this.orderList==''">
            暂无数据
        </div>
        <div v-else class="padding30">
            <el-table :data="orderList" style="width: 100%" :cell-class-name="cell">
                <el-table-column prop="user_id" label="用户id" width="80">
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称" width="120">
                </el-table-column>
                <el-table-column prop="title" label="课程名" width="180">
                </el-table-column>
                <el-table-column prop="out_trade_no" label="商户订单号">
                </el-table-column>
                <el-table-column prop="transaction_id" label="微信订单号">
                </el-table-column>
                <el-table-column prop="amount" label="订单金额" width="120">
                </el-table-column>
                <el-table-column prop="pay_type" :formatter="payTypeFormat" label="支付方式" width="100">
                </el-table-column>
                <el-table-column prop="pay_status" :formatter="payStatus"  label="支付状态" width="100">
                </el-table-column>
            </el-table>
        </div>
        <!--底部分页-->
        <el-col :span="24" class="toolbar padding30">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page" :page-size="query.count" layout="total, sizes, prev, pager, next, jumper" :total="total_rows" style="float:right;">
            </el-pagination>
        </el-col>
    </div>
</template>

<script>
import Api from "../../api";
export default {
  data() {
    return {
      options: [
        {
          label: "创建",
          value: "create"
        },
        {
          label: "成功",
          value: "success"
        },
        {
          label: "失败",
          value: "fail"
        },
        {
          label: "取消",
          value: "cancel"
        }
      ],
      orderList: [],
      query: {
        page: 1,
        count: 10,
        search: ""
      },
      total_rows: 0,
      success: false
    };
  },
  beforeCreate() {
    // location.reload()
  },
  created() {
    this.getOrderList();
  },
  mounted() {},
  methods: {
    cell({row, column, rowIndex, columnIndex}) {
      if(columnIndex == 7 && row.pay_status == 'success'){
        return 'success'
      }
    },
    send_query() {
      this.getOrderList();
    },
    getOrderList() {
      Api.course.orders_list(this.query).then(res => {
        res.data.map(item => {
          item.amount = parseFloat(item.amount) / 100;
          return item;
        });
        this.orderList = res.data;
        this.total_rows = res.total;
      });
    },
    payTypeFormat(row, column, pay_type) {
      switch (pay_type) {
        case "wxpay":
          pay_type = "微信支付";
          break;
        case "alipay":
          pay_type = "其他方式支付";
      }
      return pay_type;
    },
    payStatus(row, column, pay_status) {
      switch (pay_status) {
        case "create":
          pay_status = "未支付";
          break;
        case "success":
          pay_status = "已支付";
          break;
        case "fail":
          pay_status = "未支付";
          break;
        case "cancel":
          pay_status = "未支付";
          break;
      }
      return pay_status;
    },
    //分页
    handleCurrentChange(val) {
      this.query.page = val;
      this.getOrderList();
    },
    handleSizeChange(val) {
      this.query.page = 1;
      this.query.count = val;
      this.getOrderList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.orderList {
  /* padding: 0 30px; */
  background-color: #fff;
}
.orderList .demo-form-inline {
  margin-top: 10px;
  padding: 10px 30px 0 30px;
}
.padding30 {
  padding: 0 30px;
}
.success {
  color: red
}
.orderList .toolbar {
  background-color: #fff;
  padding-bottom: 10px;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
