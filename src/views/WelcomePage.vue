<template>
  <el-row type="flex" justify="center">
     <el-col :span="24">
         <el-card>
             <h1>Device Transaction</h1>
             <el-button type="primary" @click="fetchDeviceTransaction">Refresh</el-button>
             <ul>
                 <li v-for="transaction in deviceTransactions" :key="transaction._id">
                     {{transaction.productDoc.name}}<br>
                     <vue-json-pretty
                             :path="'res'"
                             :data="transaction.details"
                     >
                     </vue-json-pretty>
                 </li>
             </ul>
         </el-card>
     </el-col>
  </el-row>
</template>


<script>
    import {provider} from "../service/provider";
    import axios from 'axios';
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        components: {
            VueJsonPretty
        },
        data() {

            return {
                deviceTransactions: [],
            }
        },
        computed: {
            isActiveStore () {
                const {activeStore} = this.$store.state.user;
                return activeStore;
            }
        },
        methods: {
            fetchDeviceTransaction() {
                const {activeStore} = this.$store.state.user;
                const url = `${provider.baseURL}${provider.prefix}/device_transaction_detail/${activeStore}`;
                if (activeStore) {
                    axios.get(url)
                        .then(res => {
                            console.log(res);
                            if (res.data.code === 201) {
                                this.deviceTransactions = res.data.data;
                            }
                        })
                }
            }
        },
        created() {
            this.fetchDeviceTransaction();
        }
    }
</script>