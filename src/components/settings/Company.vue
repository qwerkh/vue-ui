<template>
    <el-row>
        <el-form :model="companyForm" :rules="rules" ref="company">
            <el-row>
                <el-form-item label="Logo">
                    <el-upload
                            v-loading="uploadProgress"
                            action="#"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :auto-upload="false"
                            :file-list="fileList"
                            :on-change="onUploadChange"
                            :on-remove="handleRemove">

                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="ឈ្មោះ" prop="name">
                        <el-input v-model="companyForm.name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="បើកលក់ម៉ោង" prop="startHour">
                        <el-time-select
                                placeholder="បើកលក់ម៉ោង"
                                v-model="companyForm.startHour"
                                :picker-options="startTimeOptions">
                        </el-time-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="បិទលក់ម៉ោង" prop="closeHour">
                        <el-time-select
                                placeholder="បិទលក់ម៉ោង"
                                v-model="companyForm.closeHour"
                                :picker-options="{
                    start: '06:30',
                    step: '00:15',
                    end: '23:45',
                    minTime: companyForm.startHour
                }">
                        </el-time-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="រូបិយប័ណ្ណ">
                    <el-col :span="4">
                        <el-radio v-model="companyForm.defaultCurrency" v-for="(c,index) in defaultCurrencyOptions"
                                  :key="index" :label="c">{{c}}
                        </el-radio>

                    </el-col>
                </el-form-item>
                <el-form-item :label="displayCurrencyConversion('KHR')" prop="exchangeRate.KHR">
                    <el-col :span="8">
                        <el-input v-model="companyForm.exchangeRate.KHR"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="displayCurrencyConversion('USD')" prop="exchangeRate.USD">
                    <el-col :span="8">
                        <el-input v-model="companyForm.exchangeRate.USD"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item :label="displayCurrencyConversion('THB')" prop="exchangeRate.THB">
                    <el-col :span="8">
                        <el-input v-model="companyForm.exchangeRate.THB"></el-input>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row>
                <el-button type="primary" @click="handleSave" :loading="loading">រក្សាទុក</el-button>
            </el-row>
        </el-form>
    </el-row>
</template>


<script>
    import {provider, app} from "../../service/provider";
    import axios from 'axios';

    export default {
        data() {
            return {
                id: "",
                companyForm: {
                    name: "",
                    defaultCurrency: "KHR",
                    startHour: "07:00",
                    closeHour: "20:00",
                    logoUrl: "",
                    exchangeRate: {
                        KHR: 0,
                        USD: 0,
                        THB: 0
                    }
                },
                uploadProgress: false,
                loading: false,
                fileList: [],
                dialogImageUrl: '',
                dialogVisible: false,
                startTimeOptions: {
                    start: '06:30',
                    step: '00:15',
                    end: '23:45'
                },
                defaultCurrencyOptions: ["KHR", "USD"],

                rules: {
                    name: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                    ],
                    startHour: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                    ],
                    closeHour: [
                        {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                    ],
                    exchangeRate: {
                        KHR: [
                            {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                        ],
                        USD: [
                            {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                        ],
                        THB: [
                            {required: true, message: "តម្រូវអោយបំពេញ", trigger: 'blur'}
                        ],
                    }
                },


            }
        },
        methods: {
            displayCurrencyConversion(toCurrency){
                return this.companyForm.defaultCurrency + ' - ' + toCurrency;
            },
            handleSave() {
                const {token, user} = this.$store.state.user;
                this.$refs['company'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        const url = `${provider.baseURL}${provider.prefix}/company/${this.id}/edit/${user._id}`;
                        axios.post(url, this.companyForm, {
                            headers: {
                                token
                            }
                        }).then((res) => {
                            this.loading = false;
                            if (res.data.code === 201) {
                                this.$message.success("កែប្រែបានជោគជ័យ")
                            } else {
                                this.$message.error(res.data.message);
                            }
                        })
                            .catch((err) => {
                                this.loading = false;
                            })
                    }
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleUpload() {
                this.uploadProgress = true;
                var storageRef = app.storage().ref()
                let vm = this;
                this.fileList.map(file => {
                        this.blobToDataString(file.url, (data) => {
                            var uploadTask = storageRef.child(`/images/${file.name}`)
                                .putString(data, 'data_url');
                            uploadTask.on('state_changed', function (snapshot) {
                                // Observe state change events such as progress, pause, and resume
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                if (progress >= 100) {
                                    vm.uploadProgress = false;
                                }

                            }, function (error) {
                                vm.uploadProgress = false;
                            }, function () {
                                // Handle successful uploads on complete
                                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                    vm.companyForm.logoUrl = downloadURL;
                                });
                            });
                        })
                    }
                )
            },
            onUploadChange(file, fileList) {

                const matchExtension = file.name.match(/jpg|png|jpeg/g);
                if (!matchExtension) {
                    this.$message.error("Must be a jpg, png or csv jpeg");
                    this.fileList = [];
                } else {
                    if (fileList.length > 0) {
                        this.fileList = fileList.slice(-1);
                        this.handleUpload();
                    } else {
                        this.fileList = fileList;
                        this.handleUpload();

                    }
                }
            },
            blobToDataString(blob, callback) {
                let xhr = new XMLHttpRequest();
                xhr.responseType = "blob";

                xhr.onload = function () {
                    let recoveredBlob = xhr.response;

                    let reader = new FileReader();

                    reader.onload = function () {
                        let blobAsDataString = reader.result;
                        callback(blobAsDataString);
                    };

                    reader.readAsDataURL(recoveredBlob);
                };

                xhr.open("GET", blob);
                xhr.send();
            },
            fetchCompany() {
                axios.get(`${provider.baseURL}${provider.prefix}/company`)
                    .then((res) => {
                        if (res.data.code === 201) {
                            let data = res.data.data[0];
                            this.id = data._id;
                            if (data.logoUrl) {
                                this.fileList.push({
                                    name: "",
                                    url: data.logoUrl
                                })
                            }
                            for (let k in this.companyForm) {
                                this.companyForm[k] = data[k];
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        },
        created() {
            this.fetchCompany();
        }
    }
</script>