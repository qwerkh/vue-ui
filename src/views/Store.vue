<template>
    <transition name="el-zoom-in-top">
        <el-row :gutter="20">
            <el-col :gutter="20" :span="8" v-for="(o, index) in this.storeData" :key="o._id"  >
                <el-card :body-style="{ padding: '0px' }" >
                    <div style="padding: 14px;">
                        <h4>{{o.name}} (<span> {{o.shortcutName}} </span>)</h4>
                        <h5>{{o.address}}</h5>
                        <div class="bottom clearfix">
                            <time class="time">{{o.createdAt | moment('DD/MM/YYYY HH:mm')}}</time>
                            <el-button type="primary" class="button" @click="handleClick(o)">កែប្រែ</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </transition>
</template>


<script>
    import {provider} from "../service/provider";
    import axios from 'axios';
    export default {
        data() {
            return {
                storeData: []
            }
        },
        methods: {
            fetchStores() {
                const {token, user} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/store/list`;
                axios
                    .post(
                        `${url}`,
                        {
                            requestId: user._id
                        },
                        {
                            headers: {
                                token: token
                            }
                        }
                    )
                    .then(response => {
                        const data = response.data;
                        if (data.code == 403) {
                            this.$message.error(data.message);
                        } else {
                            this.storeData = data.data;
                        }
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    });
            },
            handleClick(store) {
                this.$router.push('/stores/add/' + store._id);
            }
        },
        created() {
            this.fetchStores();
        }
    }
</script>