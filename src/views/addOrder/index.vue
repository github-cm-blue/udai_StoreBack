<template>
  <div class="app-container">
      <el-form ref="form" :model="order" label-width="120px">
        <el-form-item label="订单编号">
        <el-input v-model="order.name" />
      </el-form-item>

      

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        name: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}</style>
