<template>
    <div class="login flex">
        <div class="flex-box flex-box-bg login-none">
            <img src="../assets/login.svg" alt>
        </div>
        <div class="flex-box flex-box-form">
            <el-row :gutter="20" style="margin:0;">
                <div class="login-logo flex center">
                    <img src="../assets/logo.png" alt>
                </div>
                <el-form
                        :model="loginForm"
                        :rules="rules"
                        ref="loginForm"
                        class="demo-ruleForm flex center"
                >
                    <el-col :span="12" :xs="18">
                        <el-form-item label prop="username">
                            <el-input
                                    class="input-field"
                                    placeholder="Username"
                                    v-model="loginForm.username"
                                    prop="username"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label prop="password">
                            <el-input
                                    class="input-field"
                                    placeholder="Password"
                                    v-model="loginForm.password"
                                    type="password"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                    type="success"
                                    @click="handleLogin"
                                    :loading="isLoading"
                            >{{showLoadingText}}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </div>
    </div>
</template>


<script>
    import {provider, fetchApi} from "@/service/provider";
    import request from "superagent";
    import axios from "axios";

    export default {
        data() {
            return {
                isLoading: false,
                rules: {
                    username: [
                        {
                            required: true,
                            message: "username is required",
                            trigger: "blur"
                        },
                        {
                            min: 3,
                            max: 20,
                            message: "ឈ្មោះគណនីគួរតែចន្លោះពី 3 ទៅ​​​​​ 20 តួ",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "Password is required",
                            trigger: "blur"
                        }
                    ]
                },
                loginForm: {
                    username: null,
                    password: null
                }
            };
        },
        computed: {
            showLoadingText() {
                return this.isLoading ? "Loading..." : "Login";
            }
        },
        methods: {
            handleLogin() {
                this.$refs["loginForm"].validate(valid => {
                    if (valid) {
                        this.isLoading = true;
                        ///Uncomment the line below for mock up data and comment all line below `Production`
                        // this.$store.commit("setUser", {
                        //   token: "123",
                        //   user: { username: "thkeam" }
                        // });
                        // this.$router.push("/");

                        /// Production


                        /*setTimeout(() => {
                            request
                                .post(provider.baseURL + "/user/login")
                                .send({
                                    username: this.loginForm.username,
                                    password: this.loginForm.password
                                })
                                .end((err, result) => {
                                    if (!err) {
                                        let body = result.body;
                                        if (body.code == 201) {
                                            this.$store.commit("setUser", {
                                                token: body.token,
                                                user: body.data
                                            });
                                            this.$router.push("/");
                                        } else {
                                            this.isLoading = false;
                                            this.$message({
                                                type: "error",
                                                message: `${body.data}`
                                            });
                                        }
                                    }
                                });
                        }, 500);*/

                        const url = `${provider.baseURL}/api/v1/chartAccount/p4Z5FyNYdMoLBqD5i/edit`;
                        axios
                            .post(
                                `${url}`,
                                {
                                    code: "002",
                                    name: "T6666",
                                    khName: "T666666666",
                                    subAccountOf: "001",
                                    accountTypeId: "001",
                                    description: "Hi",
                                    isPaidTax: false,
                                    isPayment: true
                                },
                                {
                                    headers: {
                                        token: "eyJhbGciOiJIUzI1NiJ9.RU1veHRYSnB3THVFWUFXb1F0ZXN0.6T9c9o_3nd1HpKBqGnZDR9v2zI7BLZ6FN-QVD6zyAcY",
                                        username: "test"
                                    }
                                }
                            )
                            .then(response => {
                                const data = response.data;
                                if (data.code == 403) {
                                    this.$message.error(data.message);
                                } else {
                                    // this.tableData = data.data;
                                }
                            })
                            .catch(err => {
                                this.$message.error(err.message);
                            });


                    } else {
                        return false;
                    }
                });
            }
        },
    };
</script>

<style lang="scss">
    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans");
    @import url("https://fonts.googleapis.com/css?family=Siemreap");

    body {
        font-family: "Nunito Sans", sans-serif;
    }

    .el-main {
        padding: 0;
    }

    .login {
        width: 100%;
        position: absolute;
        height: 100vh;

        .flex-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1 1;
        }

        .flex-box-bg {
            background-color: #353535;
        }

        .flex-box-form {
            background-color: #ffffff;

            .login-logo {
                margin-bottom: 20px;

                img {
                    width: 250px;
                    height: 250px;
                }
            }
        }
    }

    .input-field .el-input__inner {
        min-height: 46px;
        width: 100%;
        padding-left: 20px;
        display: block;
        margin: 0 auto;
        outline: none;
        font-family: "Siemreap", sans-serif;
    }

    .el-form-item.is-success .el-input__inner,
    .el-form-item.is-success .el-input__inner:focus {
        border-color: #6a75ff;
    }

    .el-input__inner:focus {
        outline: none;
        border-color: #6a75ff;
    }

    .el-form-item__error {
        position: absolute;
        left: -100;
        right: 10px;
        top: 13px;
        font-size: 12px;
        text-align: right;
    }

    .el-button {
        line-height: 30px;
        border-radius: 100px;
        display: inline-block;
        cursor: pointer;
        font-weight: bold;
        white-space: nowrap;
        padding: 6px 18px;
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 0.15px;
        height: 50px;
        width: 200px;
        background-color: #6a75ff;
        border-color: #6a75ff !important;
        font-family: "Siemreap", sans-serif;

        &:hover {
            background: #6b9aff;
            border-color: #6b9aff;
            color: #fff;
            border-color: #6b9aff !important;
        }
    }

    .el-button--success:hover,
    .el-button--success:focus {
        background: #6a75ff;
        border-color: #6a75ff;
        color: #fff;
    }

    .header-descr h2 {
        color: #33373a;
        line-height: 31px;
        padding: 0;
        font-size: 28px;
        margin: 0 0 10px;
    }

    @media only screen and (max-width: 989px) {
        .login .login-none {
            display: none;
        }
    }
</style>