<template>
  <div class="app-container">
    <el-row>
      <el-col :span="1" align="left">
        <el-button type="primary" @click="addOrder()">添加订单</el-button>
      </el-col>
      <el-col :span="23" align="right">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%" max-height="450">
      <el-table-column fixed prop="orderId" label="订单编号" width="80">
        <template slot-scope="scope">
          {{ scope.row.orderId }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="200">
        <template slot-scope="scope">
          {{
            scope.row.productName.length > 10
              ? scope.row.productName.substring(0, 10) + "..."
              : scope.row.productName
          }}
        </template>
      </el-table-column>
      <el-table-column prop="turnoverTime" label="成交时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.turnoverTime }}
        </template>
      </el-table-column>

      <el-table-column prop="lastModifyTime" label="修改时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.lastModifyTime }}
        </template>
      </el-table-column>

      <el-table-column prop="payTime" label="付款时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.payTime }}
        </template>
      </el-table-column>

      <el-table-column prop="addressId" label="收货ID" width="120">
        <template slot-scope="scope">
          {{ scope.row.addressId }}
        </template>
      </el-table-column>

      <el-table-column prop="transportFirmName" label="物流信息" width="120">
        <template slot-scope="scope">
          {{ scope.row.transportFirmName }}
        </template>
      </el-table-column>

      <el-table-column prop="price" label="商品总价" width="120">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>

      <el-table-column prop="realPayMoney" label="实付款" width="120">
        <template slot-scope="scope">
          {{ scope.row.realPayMoney }}
        </template>
      </el-table-column>

      <el-table-column prop="productCount" label="数量" width="120">
        <template slot-scope="scope">
          {{ scope.row.productCount }}
        </template>
      </el-table-column>

      <el-table-column prop="pigment" label="商品购买种类" width="120">
        <template slot-scope="scope">
          {{ scope.row.pigment }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button
            @click.native.prevent="deleteRow(scope.row.orderId)"
            type="text"
            size="small"
            >移除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <router-view></router-view>
  </div>
</template>
<script>
import moment from "moment";
import { createWrapper } from '@vue/test-utils';
export default {
  data() {
    return {
      tableData: [],
      restaurants: [],
      state: "",
      timeout: null
    };
  },
  created() {
    this.fetchData();
    this.loadAll();
  },
  methods: {
    fetchData() {
      var that = this;
      this.request({
        url: "/api/Order/GetOrderAllList",
        method: "get"
      }).then(Response => {
        that.tableData = Response.data;
        // that.tableData.forEach(item => {
        //   var formatTime = moment(item.turnoverTime).format("yyyy/MM/DD");
        //   item.formatTime = formatTime;
        //   var vlastModifyTime = moment(item.lastModifyTime).format(
        //     "yyyy/MM/DD"
        //   );
        //   item.vlastModifyTime = vlastModifyTime;
        //   var vpayTime = moment(item.payTime).format("yyyy/MM/DD");
        //   item.vpayTime = vpayTime;
        // });

        console.log(that.tableData);
      });
    },
    deleteRow(oid) {
      console.log(oid);
      var that = this;
      this.request({
        url: "/api/Order/GetDeleteOrder",
        params: {
          id: oid
        },
        method: "delete"
      }).then(repose => {
        console.log(repose);
      });
    },
    addOrder() {
      this.$router.push("/orderInfo/addOrder");
    },

    loadAll() {
      //this vue对象
      var that = this;
      this.request({
        url: "/api/Order/GetOrderAllList",
        method: "get"
      }).then(response => {
        //{code:1000,message:"success",data:""}

        response.data.forEach(item => {
          that.restaurants.push(item);
        });
      });
    },
    querySearchAsync(queryString, cb) {        
      var that=this;
     
      var restaurants = this.restaurants;
      restaurants.forEach(item => {
        item.value = item.productName;
      });

      var results = queryString
        ? this.tableData=restaurants.filter(item=>{
          if(item.value.includes(queryString)){
            return item;
          }
        })
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
   
    handleSelect(item) {
      console.log(item.orderId);
      var v = item.orderId;
      var that=this;
      this.request({
        url: "/api/Order/GetOrderById?Id=" + v,
        method: "get"
      }).then(response => {
        console.log(response.data);
        that.tableData=[response.data];           
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
