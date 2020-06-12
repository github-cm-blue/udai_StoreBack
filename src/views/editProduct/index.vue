<template>
  <div class="app-container" v-if="isLoad">
    <el-form ref="form" :model="product" label-width="120px">
      <el-form-item label="商品名称">
        <el-input v-model="product.productName" />
      </el-form-item>

      <!-- <el-form-item label="商品类型">
        <el-select v-for="index in maxLevel" :key="index" v-model="currentType.categoryName" :placeholder="index+'级'">
         <span style="color:#000">{{index}}级:</span>
          <el-option v-for="item in getCategoryBypid(index)" :key="item.typeId"  :label="item.categoryName" :value="item.categoryName" ></el-option>
        </el-select>  
      </el-form-item>-->

      <el-form-item label="商品类型">
        <el-tree :props="types" :load="loadNode" lazy highlight-current show-checkbox	check-strictly check="checkType"></el-tree>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoad: false, //是否已成功加载数据
      baseUrl: "https://localhost:5000/", //服务器地址
      product: {}, //商品详情信息
      types: [],
      currentType: {},
      agentSell: {},
      maxLevel: 0,
      selected: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    checkType(node,checked){
      console.log(node);
      console.log(checked);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.types.forEach(item => {
          item.isLeat = "leaf";
        });

        this.getTypeByid(0).forEach(item => {
          return resolve([{ name: item.categoryId, label: item.categoryName }]);
        });
      }
      if (node.level > 0) {
        var ctype = this.getTypeByid(node.data.name);
        var data = [];
        ctype.forEach(item => {
          if (item.parentId != 0) {
            var obj = { name: item.categoryId, label: item.categoryName };
            data.push(obj);
          }
          if (data.length > 0) {
            resolve(data);
          } else {
            resolve({ leaf: true });
          }
        });
      }
    },
    getTypeByid(id) {
      return this.types.filter(item => {
        if (item.parentId == id) {
          return item.categoryName;
        }
      });
    },
    fetchData() {
      var that = this;
      this.request({
        url: "/api/Product/GetProductById",
        method: "get",
        params: {
          id: this.$route.params.id
        }
      }).then(
        response => {
          console.log(response);
          that.product = response.data.product;
          that.currentType = response.data.product.productCategory;
          response.data.categories.forEach(item => {
            if (item.categoryLevel > that.maxLevel) {
              that.maxLevel = item.categoryLevel;
            }
          });
          that.types = response.data.categories;

          that.isLoad = true;
        },
        error => {}
      );
    },
    //点击子图片时，将子图片变为主图
    changeMainImage(url) {
      if (
        this.productInfo.assistImage.indexOf(this.productInfo.mainImage) == -1
      ) {
        this.productInfo.assistImage += "&" + this.productInfo.mainImage;
      }
      this.productInfo.mainImage = url;
      // console.log(this.productInfo.assistImage);
    },
    //保存更改
    onSave() {
      this.request({
        url: "/api/Product/EditProduct",
        data: this.qs.stringify({
          productInfo: this.productInfo,
          currentType: this.currentType
        }),
        method: "put"
      }).then(response => {
        console.log(response);
      });
    },
    //取消修改
    onCancel() {
      //返回列表页
      this.$router.push({ name: "ProductList" });
    },
    //上传文件成功
    uploadSuccess(response) {
      console.log("上传成功");
      console.log(response);
      this.productInfo.assistImage += response.res;
    }
  },
  computed: {
    //拆分图片
    splitAssisImage() {
      return function(images) {
        var urls = images.split("&");
        //   console.log(urls);
        return urls;
      };
    },
    //商品类型分类
    getCategoryBypid() {
      return function(level) {
        var ary = [];
        this.types.forEach(item => {
          if (item.categoryLevel == level) {
            ary = [...ary, item];
          }
        });
        return ary;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>