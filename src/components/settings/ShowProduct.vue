<template>
    <el-row>
        <el-card>
            <el-row>

                <el-col :span="20" align="center">{{displayTitle}}</el-col>
                <el-col :span="4">
                    <router-link to="/settings?activeName=2">
                        <font-awesome-icon icon="times" size="lg"/>
                    </router-link>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <vue-json-pretty
                            :path="'res'"
                            :data="product"
                            >
                    </vue-json-pretty>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div style="margin-top: 15px;">
                        <el-input id="token"   v-model="token">
                            <template slot="append">
                                <span style="cursor:pointer;" @click="handleCopyProductToken">Copy</span>
                            </template>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </el-row>
</template>


<script>
    import {provider} from "../../service/provider";
    import axios from 'axios';
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        components: {
            VueJsonPretty
        },
        data() {
            return {
                token: '',
                product : null
            }
        },
        computed: {
            displayTitle(){
                const { enName} = this.$route.meta;
                return enName || "";
            }
        },
        methods: {
            handleCopyProductToken() {
                let codeToCopy =document.querySelector('#token');
                codeToCopy.setAttribute('type', 'text');
                codeToCopy.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    this.$message.success("Code copy")
                } catch (err) {
                    this.$message.error(err);
                }
            },
            getProductById(id) {
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/products/${id}`;
                axios.get(url,{
                    headers: {
                        token
                    }
                })
                    .then((res)=>{
                        if (res.data.code === 201 && res.data.data) {
                            this.product = res.data.data;
                            this.token = this.product.productToken;
                        }
                    })
            }
        },
        created() {
            const {id} = this.$route.params;
            if (!!id) {
                this.id = id;
                this.getProductById(id);
            }
        }
    }
</script>