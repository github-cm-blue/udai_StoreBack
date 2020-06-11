<template>
  <div class="app-container" v-if="isLoad">
    <el-form ref="form" :model="productInfo" label-width="120px">
      <el-form-item label="商品名称">
        <el-input v-model="productInfo.productName" />
      </el-form-item>

      <el-form-item label="商品编号">
        <el-input v-model="productInfo.artNo" />
      </el-form-item>

      <el-form-item label="代理商">
        <el-input v-model="agentSell.agentName" disabled/>
      </el-form-item>

       <el-form-item label="商品类型">
        <el-select v-for="index in maxLevel" :key="index" v-model="currentType.typeName" :placeholder="index+'级'">
         <span style="color:#000">{{index}}级：</span>
          <el-option v-for="item in classify(index-1)" :key="item.typeId"  :label="item.typeName" :value="item.typeName" ></el-option>
        </el-select>
        
      </el-form-item>

      <el-form-item label="售卖时间">
        <el-col :span="11">
          <el-date-picker
            v-model="productInfo.addTime"
            type="date"
            placeholder="上架时间"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="1" class="line">&nbsp;</el-col>
        <el-col :span="1" class="line">-</el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="productInfo.undercarriage"
            type="date"
            placeholder="下架时间"
            style="width: 100%;"
          />
        </el-col>
      </el-form-item>
<!-- angular-cli  vue-cli -->
      <el-form-item label="商品主图">
        <el-avatar shape="square" :size="100" fit="fill" :src="baseUrl+productInfo.mainImage"></el-avatar>
      </el-form-item>

      <el-form-item label="商品子图">
        <el-row :span="10" >
            <el-upload class="upload-demo" :action="baseUrl+'api/Product/UploadImage'" list-type="p" multiple  :on-success="uploadSuccess">
                 <el-button size="small" type="primary">点击上传</el-button>
                 <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-row>
        <el-col
          :span="2"
          v-for="(item,index) in splitAssisImage(productInfo.assistImage)"
          :key="index"
        >
          <el-avatar
            shape="square"
            :size="100"
            fit="fill"
            :src="baseUrl+item"
            @click.native="changeMainImage(item)"
          ></el-avatar>
        </el-col>
      </el-form-item>

      <el-form-item label="商品原价">
        <el-input v-model="productInfo.olderPrice" />
      </el-form-item>

      <el-form-item label="商品售价">
        <el-input v-model="productInfo.newPrice" />
      </el-form-item>

      <el-form-item label="累计销量">
        <el-input v-model="productInfo.sellCount" />
      </el-form-item>

      <el-form-item label="累计评论">
        <el-input v-model="productInfo.commentCount" />
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
      baseUrl: "https://localhost:5001/", //服务器地址
      productInfo: {}, //商品详情信息
      types:[],
      currentType:{},
      agentSell:{},
      maxLevel:0,
      selected:null,
    };
  },
  created() {
    this.fetchData();
    
  },
  methods: {
    fetchData() {
      this.request({
        url: "/api/Product/GetProductById",
        method: "get",
        params: {
          pid: this.$route.params.id
        }
      }).then(
        response => {
          // console.log(response);
          this.productInfo = response.res.productInfo;
          this.types=response.res.types;
          this.currentType=response.res.currentType;
          this.agentSell=response.res.agentSell;
          this.types.forEach(item=>{
            if(this.maxLevel<item.paterId+1){
              this.maxLevel=item.paterId+1;
            }
          });
          this.isLoad = true;
          // console.log(this.maxLevel);

          //   console.log(this.productInfo);
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
        url:'/api/Product/EditProduct',
        data:this.qs.stringify({
          productInfo:this.productInfo,
          currentType:this.currentType
        }),
        method:'put'
      })
      .then(response=>{
        console.log(response);
      })
    },
    //取消修改
    onCancel() {
      //返回列表页
      this.$router.push({name:'ProductList'});
    },
    //上传文件成功
    uploadSuccess(response){
        console.log('上传成功');
        console.log(response);
        this.productInfo.assistImage+=response.res;
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
    classify(){
      return function(level){
         var ary=[];
         this.types.forEach(item=>{
           if(item.paterId==level){
             ary=[...ary,item];
           }
         })
         return ary;
      }
     
    }
  }
};
</script>

<style lang="scss" scoped>
</style>