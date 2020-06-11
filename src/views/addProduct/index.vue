<template>
  <div class="app-container">
    <el-form ref="form" :model="product" label-width="120px">
      <el-form-item label="商品名称">
        <el-input v-model="product.name" />
      </el-form-item>

      <el-form-item label="店铺id">
        <el-input v-model="product.storeId" disabled />
      </el-form-item>

      <el-form-item label="商品分类">
        <el-select v-model="product.types[0]" placeholder="请选择商品分类">
          <el-option
            v-for="item in product.types"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否上架">
        <el-radio v-model="product.isMarketable" label="1">是</el-radio>
        <el-radio v-model="product.isMarketable" label="2">否</el-radio>
      </el-form-item>

      <el-form-item label="商品原价">
        <el-input v-model="product.oldPrice" />
      </el-form-item>

      <el-form-item label="商品售价">
        <el-input v-model="product.newPrice" />
      </el-form-item>

      <el-form-item label="商品售价">
        <el-upload
          class="upload-demo"
          action="http://localhost:5000/api/Product/UploadProductImage"
          multiple
          :limit="10"
          :on-exceed="handleExceed" 
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        name: "",
        storeId: 1,
        isMarketable: false,
        oldPrice: null,
        newPrice: null,
        types: []
      }
    };
  },
  //vue对象创建时候
  created() {
    var that = this;
    this.request({
      url: "/api/Product/GetProductCategorys",
      method: "get"
    }).then(response => {
      console.log(response);
      that.product.types = response.data; //axios
    });
  },
  methods: {
      handleExceed(){
           this.$message({
          message: '最多只能上传3个文件',
          type: 'warning'
        });
      }
  },
};
</script>

<style lang="scss" scoped>
</style>