<template>
   <div class="app-container">
     <el-row>
       <el-button type="primary" @click="addProduct()" round>添加商品</el-button>
       <p></p>
     </el-row>
     
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.productId }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="400">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
       <el-table-column label="商家id" width="95">
        <template slot-scope="scope">
          {{ scope.row.storeId }}
        </template>
      </el-table-column>
       <el-table-column label="商品类型id" width="95">
        <template slot-scope="scope">
          {{ scope.row.categoryId }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="95">
        <template slot-scope="scope">
          {{ scope.row.newPrice }}
        </template>
      </el-table-column>
      <el-table-column label="上架时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.sjtime }}
        </template>
      </el-table-column>
     
      <el-table-column label="库存" width="95">
        <template slot-scope="scope">
          {{ scope.row.stock }}
        </template>
      </el-table-column>
      <el-table-column label="累计销量" width="95">
        <template slot-scope="scope">
          {{ scope.row.sellCount }}
        </template>
      </el-table-column>
     <el-table-column label="操作" >
       <template slot-scope="scope">
          <el-button type="primary" @click="handleEditProduct(scope.row.productId)" round>编辑</el-button>
          <el-button type="danger" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <router-view></router-view>
  </div>
</template>

<script>
import moment from 'moment'
    export default {
        data(){
            return{
                list:null,
                listLoading:true,
                skip:0,
                take:10
            }
        },
        created(){
            this.fetchData();
        },
        methods:{
          //获取分页数据
            fetchData(){
                this.request({
                    url:'/api/Product/GetProducts',
                    params:{
                     skip:this.skip,
                     take:this.take
                    },
                    method:'get'
                })
                .then(response=>{
                    // console.log(response);
                    this.list=response.data;
                    console.log(response);

                    // //处理时间格式
                    this.list.forEach(item => {
                        //上架时间
                        item.sjtime=moment(item.createTime).format('yyyy/MM/DD'); 
                       

                    });

                    this.listLoading=false;
                },error=>{
                    console.log(error);
                    this.listLoading=false;
                    
                })
            },
            //编辑商品
            handleEditProduct(pid){
              // console.log(pid);
             this.$router.push('editProduct/'+pid)
            },
            //添加商品
            addProduct(){
              this.$router.push('addProduct')
            }

        }
    }
</script>

<style lang="scss" scoped>

</style>