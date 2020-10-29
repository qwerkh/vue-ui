<template>
    <el-row>
        <el-card>
            <el-row>

                <el-col :span="20" align="center">{{displayTitle}}</el-col>
                <el-col :span="4">
                    <router-link to="/settings?activeName=3">
                        <font-awesome-icon icon="times" size="lg"/>
                    </router-link>
                </el-col>
            </el-row>
            <el-form :model="categoryModel" :rules="rules" ref="categoryForm">
                <el-row :gutter="20">

                    <el-col :span="8">
                        <el-form-item label="Name" prop="name">
                            <el-input v-model="categoryModel.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Desc">
                            <el-input v-model="categoryModel.desc"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="Status">
                        <el-switch
                                v-model="categoryModel.isUsable"
                                active-text="Allow usage"
                                inactive-text="Not Allow Usage">
                        </el-switch>
                    </el-form-item>
                </el-row>
            </el-form>

            <el-row>
                <el-button type="primary" @click="handleSave">Save</el-button>
            </el-row>
        </el-card>
    </el-row>
</template>


<script>
    import axios from 'axios';
    import {provider} from "../../service/provider";

    export default {
        data() {
            return {
                categoryModel: {
                    _id: "",
                    name: "",
                    desc: "",
                    isUsable:true
                },
                rules: {
                    name: [
                        {
                            required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSave() {
                this.$refs['categoryForm'].validate(valid => {
                    if (valid) {
                        const {token, user} = this.$store.state.user;
                        const url = `${provider.baseURL}${provider.prefix}/categories/upsert`;
                        this.categoryModel.createdBy = user._id;
                        axios.post(url, this.categoryModel, {
                            headers: {
                                token
                            }
                        })
                            .then((res) => {
                                if (res.data.code === 201) {
                                    this.$message.success("ប្រតិបត្តិការជោគជ័យ");
                                    if (this.categoryModel._id) {
                                        this.$router.push('/settings?activeName=3');
                                    } else {
                                        Object.assign(this.$data, this.$options.data.apply(this)); //clear property after success

                                    }
                                } else {
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch((err) => {
                                this.$message.error(err.message);
                            })
                    }
                })
            },
            fetchCategoryById(id) {
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/categories/${id}`;
                axios.get(url, {
                    headers: {
                        token
                    }
                }).then((res) => {
                    if (res.data.code === 201) {
                        if (res.data.data.length > 0) {
                            const d = res.data.data[0];
                            for (let k in this.categoryModel) {
                                this.categoryModel[k] = d[k];
                            }
                        }

                    }
                })
            }
        },
        computed: {
            displayTitle() {
                const {enName} = this.$route.meta;
                return enName || "";
            }
        },
        created() {
            const {id} = this.$route.params;
            if (id) {
                this.fetchCategoryById(id);
            }
        }
    }
</script>