<template>
    <transition name="el-zoom-in-top">
        <el-row :gutter="20" v-show="true">
            <el-col :span="24">
                <h2>{{this.editUserForm.username}}</h2>
                <el-row>
                    <el-form :model="editUserForm" :rules="rules" ref="editUser">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="លេខទូរស័ព្ទ" prop="tel">
                                    <el-input
                                            type="number"
                                            v-model="editUserForm.tel"
                                            placeholder="15427757"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="ជ្រើសរើសហាង">
                                    <el-select
                                            v-model="editUserForm.stores"
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
                                            v-model="editUserForm.roles"
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
                            <el-switch v-model="editUserForm.profile.approved" active-text="បើកសិទ្ធ"
                                       inactive-text=""></el-switch>
                        </el-row>
                    </el-form>
                </el-row>
                <el-row>
                    <br>
                    <el-button style="background: orange" @click="dialogFormVisible=true" :loading="isLoading">
                        ផ្លាស់ប្តូរពាក្យសម្ងាត់
                    </el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="isLoading">កែប្រែ</el-button>
                </el-row>
            </el-col>
            <!--Modal change password-->
            <el-dialog title="ផ្លាស់ប្តូរពាក្យសម្ងាត់" :visible.sync="dialogFormVisible">
                <el-form :model="changePasswordForm" :rules="rules" ref="changePass">
                    <el-form-item label="ពាក្យសម្ងាត់" prop="password">
                        <el-input type="password" v-model="changePasswordForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="បញ្ចាក់ពាក្យសម្ងាត់" prop="confirmPassword">
                        <el-input type="password" v-model="changePasswordForm.confirmPassword" autocomplete="off"></el-input>

                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="handleChangePassword">ផ្លាស់ប្តូរ</el-button>
  </span>
            </el-dialog>
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
                } else if (value !== this.changePasswordForm.password) {
                    callback(new Error("ពាក្យសម្ងាត់មិនត្រូវគ្នា"));
                } else {
                    callback();
                }
            };
            return {
                dialogFormVisible: false,
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
                        {min: 8, max: 11, message: "តិចបំផុត​ ៨ លេខ ច្រើនបំផុត​ ១១ លេខ", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"}
                    ],
                    confirmPassword: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: "blur"},
                        {validator: validConfirmPass, trigger: "blur"}
                    ]
                },
                changePasswordForm: {
                    password: "",
                    confirmPassword: ""
                },
                editUserForm: {
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
                const {token,user} = this.$store.state.user;
                const {id} = this.$route.params;
                const url = `${provider.baseURL}/user/update/${id}/r/${user._id}`;
                this.$refs['editUser'].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        axios.post(url, this.editUserForm, {
                            headers: {
                                token
                            }
                        })
                            .then((res) => {
                                if (res.data.code === 201) {
                                    this.$message.success("កែប្រែបានជោគជ័យ");
                                    this.isLoading = false;
                                    this.$router.push('/settings');
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
            },
            handleChangePassword() {
                const {token,user} = this.$store.state.user;
                const {id} = this.$route.params;
                const url = `${provider.baseURL}/user/update/${id}/r/${user._id}/change_password`;
                this.$refs['changePass'].validate(valid => {
                    if(valid){
                        this.dialogFormVisible=false;
                        axios.post(url,{
                            password: this.changePasswordForm.password
                        },{
                            headers: {
                                token
                            }
                        })
                            .then((res)=>{
                                if(res.data.code === 201){
                                    this.$message.success('ប្តូរពាក្យសម្ងាត់បានជោគជ័យ');
                                    this.$router.push('/settings');

                                }else{
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch((er)=>{
                                this.$message.error(er.message);
                            })
                    }
                })
            },
            fetchProfile(id) {
                const {token, user} = this.$store.state.user;
                const url = `${provider.baseURL}/user/profile`;
                axios.post(url, {_id: id, requestId: user._id}, {
                    headers: {
                        token
                    }
                })
                    .then((res) => {
                        if (res.data.code === 201) {
                            let data = res.data.data;
                            for (let k in this.editUserForm) {
                                this.editUserForm[k] = data[k];
                            }
                        }
                    })
                    .catch((er) => {
                        this.$message.error(er);
                    })
            }
        },
        created() {
            const {id} = this.$route.params;
            this.fetchProfile(id);
            this.fetchStores();
        }
    };
</script>
