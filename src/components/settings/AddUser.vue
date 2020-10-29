<template>
    <transition name="el-zoom-in-top">
        <el-row :gutter="20" v-show="true">
            <el-col :span="24">
                <el-row>
                    <h2>Add user</h2>
                </el-row>
                <el-row>
                    <el-form :model="createUserForm" :rules="rules" ref="createUser">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="ឈ្មោះអ្នកប្រើប្រាស់" prop="username">
                                    <el-input v-model="createUserForm.username" placeholder="Kevin"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="លេខទូរស័ព្ទ" prop="tel">
                                    <el-input
                                            type="number"
                                            v-model="createUserForm.tel"
                                            placeholder="15427757"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="ពាក្យសម្ងាត់" prop="password">
                                    <el-input
                                            type="password"
                                            v-model="createUserForm.password"
                                            placeholder="ពាក្យសម្ងាត់"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="បញ្ញាក់លេខសម្ងាត់" prop="confirmPassword">
                                    <el-input
                                            type="password"
                                            v-model="createUserForm.confirmPassword"
                                            placeholder="បញ្ជាក់លេខសម្ងាត់"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="ជ្រើសរើសហាង">
                                    <el-select
                                            v-model="createUserForm.stores"
                                            multiple
                                            placeholder="ជ្រើសរើសហាង"
                                            style="width: 400px;"
                                    >
                                        <el-option
                                                v-for="item in storeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="ជ្រើសរើសតួនាទី">
                                    <el-select
                                            v-model="createUserForm.roles"
                                            multiple
                                            placeholder="ជ្រើសរើសតួនាទី"
                                            style="width: 400px;"
                                    >
                                        <el-option
                                                v-for="item in rolesOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-switch v-model="createUserForm.profile.approved" active-text="បើកសិទ្ធ"
                                       inactive-text=""></el-switch>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row>
                    <br>
                    <el-button type="primary" @click="handleSubmit" :loading="isLoading">បង្កើតអ្នកប្រើប្រាស់</el-button>
                </el-row>
            </el-col>
        </el-row>
    </transition>
</template>

<script>
    import {provider} from "@/service/provider";
    import axios from "axios";

    export default {
        data() {
            let validConfirmPass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("តម្រូវអោយបំពេញ"));
                } else if (value !== this.createUserForm.password) {
                    callback(new Error("ពាក្យសម្ងាត់មិនត្រូវគ្នា"));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                storeOptions: [],
                rolesOptions: [
                    {
                        label: "Admin",
                        value: "admin"
                    },
                    {
                        label: "GM",
                        value: "gm"
                    },
                    {
                        label: "Decore",
                        value: "decore"
                    },
                    {
                        label: "Cashier",
                        value: "cashier"
                    },
                    {
                        label: "Customer",
                        value: "customer"
                    }
                ],
                rules: {
                    username: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"},
                        {min: 5, message: "តិចបំផុត​ ៥ អក្សរ", trigger: "blur"}
                    ],
                    tel: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"},
                        {min: 8, max: 11,  message: "តិចបំផុត​ ៨ លេខ ច្រើនបំផុត​ ១១ លេខ", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"}
                    ],
                    confirmPassword: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"},
                        {validator: validConfirmPass, trigger: "blur"}
                    ]
                },
                createUserForm: {
                    username: "",
                    password: "",
                    confirmPassword: "",
                    tel: "",
                    profile: {
                        approved: true
                    },
                    stores: [],
                    roles: []
                }
            };
        },
        methods: {
            fetchStores() {
                const {token, user} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/store/all`;
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
                            this.storeOptions = data.data;
                        }
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    });
            },
            handleSubmit() {
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}/user/create`;
                this.$refs['createUser'].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        axios.post(url, this.createUserForm, {
                            headers: {
                                token
                            }
                        })
                            .then((res) => {
                                if (res.data.code === 201) {
                                    this.$message.success("បង្កើតអ្នកប្រើប្រាស់បានជោគជ័យ");
                                    Object.assign(this.$data, this.$options.data.apply(this)); //clear property after success
                                    this.isLoading = false;
                                } else {
                                    this.$message.error(res.data.message);
                                    this.isLoading = false;

                                }

                            })
                            .catch((er) => {
                                this.$message.error(er.message);
                                this.isLoading = false;

                            })
                    }
                })
            }
        },
        created() {
            this.fetchStores();
        }
    };
</script>
