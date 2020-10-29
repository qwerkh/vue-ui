<template>
  <transition name="el-zoom-in-top">

  <el-tabs v-model="activeName"  type="border-card" v-show="true">
    <el-tab-pane>
      <span slot="label">
           <font-awesome-icon icon="user" />
        Users
      </span>
      <user/>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label">
       <font-awesome-icon icon="building" /> Company
      </span>
      <company/>
    </el-tab-pane>
    <el-tab-pane label="Product">
      <product/>
    </el-tab-pane>
    <el-tab-pane label="Category">
      <category></category>
    </el-tab-pane>
  </el-tabs>
  </transition>
</template>

<script>
import Company from "@/components/settings/Company.vue";
import User from "@/components/settings/User.vue";
import Product from '@/components/settings/Product.vue';
import Category from '@/components/settings/Category.vue';
export default {
  components: {
    Company,
    User,
    Product,
    Category
  },
  data(){
    return {
      activeName: ""
    }
  },
  created() {
    const {activeName} = this.$route.query;
    if (!!activeName) {
      this.activeName = activeName;
    }
  }
};
</script>
