<template>
    <el-row>
        <h2>Products
            <el-button type="primary" icon="el-icon-plus" @click="handleCreateProduct">Create Product</el-button>
        </h2>
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <el-input placeholder="Search name  000001" v-model="query"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="4" v-for="(o) in products" :key="o._id">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="padding: 14px;">
                        <span>{{o.name}}({{o.skewNumber}})</span>
                        <div class="bottom clearfix">
                            <time class="time">{{o.timestamp | moment('DD/MM/YYYY HH:mm')}}</time>
                        </div>
                        <el-row type="flex" justify="end">
                            <el-dropdown  @command="handleCommand(o,$event)">
                              <span class="el-dropdown-link">
                               ជម្រើស <font-awesome-icon icon="ellipsis-v"/>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="show">Show</el-dropdown-item>
                                    <el-dropdown-item command="edit">Edit</el-dropdown-item>
                                    <el-dropdown-item command="remove">Remove</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row v-show="!query">
            <el-pagination
                    background
                    :page-size="limit"
                    :current-page.sync="currentPage"
                    layout="total,prev, pager, next"
                    :total="total">
            </el-pagination>
        </el-row>
    </el-row>
</template>

<script>
    import axios from 'axios';
    import {provider} from "../../service/provider";
    import _ from 'lodash';
    export default {
        data() {
            return {
                total: 0,
                currentPage: 1,
                query: '',
                limit: 10,
                skip: 0,
                products: []
            }
        },
        watch: {
            query: _.debounce(function(val){
                this.fetchProduct();
            },300),
            currentPage(val) {
                this.skip = val * this.limit - this.limit;
            },
            skip(val) {
                this.fetchProduct();
            }
        },
        methods: {
            getImageUrl(images) {
                if (images.length > 0) {
                    return `${images[0].url}?${images[0].token}`;
                }
                return require('@/assets/no-image.png');
            },
            handleCreateProduct() {
                this.$router.push('/products/add');
            },
            fetchProduct() {
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/products?q=${this.query}&limit=${this.limit}&skip=${this.skip}`;
                axios.get(url, {
                    headers: {
                        token
                    }
                })
                    .then((res)=>{
                        if (res.data.code === 201) {
                            this.products = res.data.data;
                        }
                    })
            },
            countProduct() {
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/products/count`;
                axios.get(url, {
                    headers: {
                        token
                    }
                })
                    .then((res)=>{
                        if (res.data.code === 201) {
                            this.total = res.data.data;
                        }
                    })
            },
            handleRemoveProduct(product) {
                const {token, user} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/products/${product._id}/edit`;
                product.createdBy = user._id;
                product.status = 'archived';
                axios.post(url,product, {
                    headers: {
                        token
                    }
                } )
                    .then((res) => {
                        if (res.data.code === 201) {
                            this.$message.success('ប្រតិបត្តិការបានជោគជ័យ');
                            this.products = this.products.filter(o => o._id !== product._id);
                            this.total -= 1;
                        }else{
                            this.$message.error(res.data.message);
                        }
                    })
                    .catch((err) => {
                    })
            },
            handleCommand(o,command){
                if (command === 'edit') {
                    this.$router.push(`/products/${o._id}/edit`);
                }else if(command === 'remove'){
                    this.$alert(`ចង់លុបទំនិញ ${o.name}?`, 'បញ្ជាក់', {
                        confirmButtonText: 'OK',
                        callback: action => {
                            if (action === 'confirm') {
                                this.handleRemoveProduct(o);
                            }
                        }
                    });
                }else if (command === 'show') {
                    this.$router.push(`/products/${o._id}/show`);
                }
            }

        },
        created() {
            this.fetchProduct();
            this.countProduct();
        }
    }
</script>

<style>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>