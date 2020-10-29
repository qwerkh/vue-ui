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
                <el-form :model="addProduct" :rules="rules" ref="addProductForm">
                    <!--<el-form-item label="រូបភាព">-->
                        <!--<el-upload-->
                                <!--v-loading="uploadProgress"-->
                                <!--action="#"-->
                                <!--multiple-->

                                <!--list-type="picture-card"-->
                                <!--:on-preview="handlePictureCardPreview"-->
                                <!--:auto-upload="false"-->
                                <!--:file-list="fileList"-->
                                <!--:on-change="onUploadChange"-->
                                <!--:on-remove="handleRemoveFile">-->
                            <!--<i class="el-icon-upload"></i>-->
                        <!--</el-upload>-->
                        <!--<el-dialog :visible.sync="dialogVisible">-->
                            <!--<img width="100%" :src="dialogImageUrl" alt="">-->
                        <!--</el-dialog>-->
                    <!--</el-form-item>-->
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="Name" prop="name">
                                <el-input placeholder="Product name..." v-model="addProduct.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Code" prop="skewNumber">
                                <br>
                                <el-autocomplete
                                        style="width: 500px;"
                                        v-model="addProduct.skewNumber"
                                        :fetch-suggestions="querySearchAsync"
                                        placeholder="000001"
                                        @select="handleSelect"
                                ></el-autocomplete>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Product Token" prop="productToken">
                                <el-input disabled  v-model="addProduct.productToken">
                                    <template slot="append">
                                        <span @click="handleGenerateProductToken" style="cursor: pointer">
                                            <i class="el-icon-tickets"></i>
                                        </span>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-form-item label="Notification when min lesser than">
                                <el-input v-model="addProduct.notificationWhen.min"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Notification when max greater than">
                                <el-input v-model="addProduct.notificationWhen.max"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="Category">
                                <el-select v-model="addProduct.categoryId" placeholder="Choose category">
                                    <el-option
                                            v-for="item in categoryOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
            </el-row>
            <el-row type="flex" class="row-bg" justify="left">
                <el-col :span="8">
                    <el-button type="primary" @click="handleSave" :loading="isLoading">Save</el-button>
                </el-col>
            </el-row>
        </el-card>
    </el-row>
</template>

<script>
    import {app, provider} from '../../service/provider';
    import moment from 'moment';
    import axios from 'axios';
    import _ from 'lodash';

    var hash = require('hash.js')
    export default {
        data() {
            let validateExpiredAt = (rule, value, callback) => {
                if (this.addProduct.type === 'stock' && !value) {
                    callback(new Error("តម្រូវអោយបំពេញថ្ងៃផុតកំណត់"));
                } else {
                    callback();
                }
            };
            let validateFinishAddedToSlideDate = (rule, value, callback) => {
                if (this.addProduct.isAddToSlide && !value) {
                    callback(new Error("តម្រូវអោយបំពេញថ្ងៃបញ្ចប់ស្លាយ"));
                } else {
                    callback();
                }
            };
            return {
                categoryOptions: [],
                id: null,
                isLoading: false,
                companyDoc: null,
                options: {
                    disabledDate(time) {
                        return time.getTime() <= Date.now();
                    },
                },
                productTypes: ['none-stock', 'stock'],
                dialogImageUrl: "",
                dialogVisible: false,
                uploadProgress: false,
                fileList: [],
                addProduct: {
                    name: "",
                    skewNumber: "",
                    createdBy : "",
                    categoryId: "",
                    productToken: "",
                    notificationWhen: {
                        min: 0,
                        max: 0
                    }
                },
                rules: {
                    expiredAt: [
                        {validator: validateExpiredAt, trigger: 'blur'}
                    ],
                    finishedAddToSlideAt: [
                        {validator: validateFinishAddedToSlideDate, trigger: 'blur'}
                    ],
                    name: [
                        {
                            required: true, trigger: 'blur', message: "តម្រូវអោយបំពេញ"
                        },
                        {
                            min: 5, trigger: 'blur', message: "យ៉ាងតិចបំបេញងោយបាន​ ៥តួ"
                        }
                    ],
                    skewNumber: [
                        {
                            required: true, trigger: 'blur', message: "តម្រូវអោយបំពេញ"
                        },
                    ],
                    productToken: [
                        {
                            required: true, trigger: 'blur', message: "តម្រូវអោយបំពេញ"
                        },
                    ]

                }
            }
        },
        methods: {
            handleGenerateProductToken() {
                const {user,activeStore} = this.$store.state.user;
                let milliSecond = moment().millisecond();
                let randomNumber = (Math.random()*99999).toFixed().toString();
                let hashToken = hash.sha256().update(milliSecond + randomNumber + activeStore).digest('hex');
                this.addProduct.productToken = `${user._id}-${hashToken}`;
            },
            querySearchAsync: _.debounce(function(queryString,cb){
                let vm = this;
                const {token} = vm.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/products?s=${queryString}`;
                axios.get(url,{
                    headers: {
                        token
                    }
                }).then((res)=>{
                    if (res.data.code === 201) {
                        const skewNumbers = res.data.data.map(map => ({value: map.skewNumber, skewNumber: map.skewNumber}));
                        const filter = product => product.skewNumber.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
                        const results = queryString ? skewNumbers.filter(filter) : skewNumbers;
                        cb(results);
                    }else{
                        cb([]);
                    }
                })
                    .catch((err)=>{
                        console.log(err)
                    })
            }, 200),
            fetchCategories(){
                const {token} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/categories/all?s=true`;
                axios.get(url,{
                    headers:{
                        token
                    }
                })
                    .then((res)=>{
                        if (res.data.code === 201) {
                            this.categoryOptions = res.data.data.map(map => ({
                                label: map.name,
                                value: map._id
                            }))
                        }
                    })


            },
            handleSelect(item) {
               this.addProduct.skewNumber = item.value;
            },
            handleRemoveFile(file, fileList) {
                const index = this.fileList.findIndex(o => o.name === file.name);
                this.addProduct.imageUrl.splice(index, 1);
                this.fileList = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleUpload() {
                var storageRef = app.storage().ref()
                let vm = this;
                // this.addProduct.imageUrl = [];
                this.uploadProgress = true;

                this.fileList.map(file => {
                        this.blobToDataString(file.url, (data) => {
                            var uploadTask = storageRef.child(`/images/products/${file.name}`)
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
                                    const splitUrl = downloadURL.split('?');
                                    const f = vm.addProduct.imageUrl.filter(e => e.url == splitUrl[0]);
                                    if (f.length == 0) {
                                        vm.addProduct.imageUrl.push({
                                            url: splitUrl[0],
                                            token: splitUrl[splitUrl.length - 1]
                                        });
                                    }
                                });
                            });
                        })
                    }
                )
            },
            onUploadChange(file, fileList) {

                const matchExtension = file.name.match(/jpg|png|jpeg/g);
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!matchExtension) {
                    this.$message.error("Must be a jpg, png or csv jpeg");
                    return false;
                } else if (!isLt5M) {
                    this.$message.error("Image can not exceed 2M");
                    return false;
                } else {
                    if (fileList.length > 5) {
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
            handleSave() {
                const {token,user,activeStore} = this.$store.state.user;
                //if id is exist we return edit url else we return add url
                const url = !!this.id ?  `${provider.baseURL}${provider.prefix}/products/${this.id}/edit`  : `${provider.baseURL}${provider.prefix}/products/add`;
                this.isLoading = true;
                this.$refs['addProductForm'].validate(valid => {
                    if (valid) {
                        this.addProduct.createdBy = user._id;
                        this.addProduct.storeId = activeStore;
                        axios.post(url,this.addProduct, {
                            headers: {
                                token
                            }
                        } )
                            .then((res) => {
                                this.isLoading = false;
                                if (res.data.code === 201) {
                                    this.$message.success('ប្រតិបត្តិការបានជោគជ័យ');
                                    if (!!this.id) { // if id exist we will return the product after update
                                        this.$router.push('/settings?activeName=2');
                                    }else{
                                        Object.assign(this.$data, this.$options.data.apply(this)); //clear property after success

                                    }
                                }else{
                                    this.$message.error(res.data.message);
                                }
                            })
                            .catch((err) => {
                                this.isLoading = false;
                            })
                    }else{
                        this.isLoading = false;
                    }
                })
            },
            fetchCompany() {
                axios.get(`${provider.baseURL}${provider.prefix}/company`)
                    .then((res) => {
                        if (res.data.code === 201) {
                            let data = res.data.data[0];
                            this.companyDoc = data;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
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
                            const data = res.data.data;
                            for (let k in this.addProduct) {
                                if(k === 'notificationWhen'){
                                    this.addProduct[k] = {
                                        min: !data[k] ? 0 :  data[k].min,
                                        max: !data[k] ?  0 : data[k].max
                                    }
                                }else{
                                    this.addProduct[k] = data[k];

                                }
                            }
                        }
                    })
            }
        },
        watch: {
            'addProduct.isAddToSlide'(val) {
                if (val) {
                    this.addProduct.finishedAddToSlideAt = moment().toDate()
                } else {
                    this.addProduct.finishedAddToSlideAt = null;
                }
            },
            'addProduct.type'(val) {
                if (val === 'stock') {
                    this.addProduct.expiredAt = moment().endOf('day').toDate()
                } else {
                    this.addProduct.expiredAt = null;
                }
            }
        },
        computed: {
            pricePlaceHolder() {
                return this.companyDoc && this.companyDoc.defaultCurrency === 'KHR' ? "20,000" : "2";
            },
            displayTitle(){
                const { enName} = this.$route.meta;
                return enName || "";
            }
        },
        created() {
            const {id} = this.$route.params;
            if (!!id) {
                this.id = id;
                this.getProductById(id);
            }else{
                this.handleGenerateProductToken();

            }
            this.fetchCompany();
            this.fetchCategories();
        }

    }
</script>