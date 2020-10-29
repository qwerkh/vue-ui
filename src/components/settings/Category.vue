<template>
    <el-row>
       <el-button icon="el-icon-plus" type="primary" @click="handleCreateNewCategory">Create new </el-button>
        <el-row>
            <el-table
                    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                    style="width: 100%"
                    @row-click="handleClick">
                <el-table-column
                        label="Date"
                        >
                    <template slot-scope="scope">
                        {{scope.row.timestamp | moment('DD/MM/YYYY HH:mm')}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="Name"
                        prop="name">
                </el-table-column>
                <el-table-column
                        label="Desc"
                        prop="desc">
                </el-table-column>
                <el-table-column
                        label="Status"
                       >
                    <template slot-scope="scope">
                        {{scope.row.isUsable ? "Allow" : "Not Allow"}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="right">
                    <template slot="header" slot-scope="scope">
                        <el-input
                                v-model="search"
                                size="mini"
                                placeholder="Find name ..."/>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </el-row>
</template>

<script>
    import {provider} from "../../service/provider";
    import axios from 'axios';
    export default  {
        data() {
            return {
                tableData: [],
                search: '',
            }
        },
        methods: {
            fetchAllCategory(){
                const {token} = this.$store.state.user;
                const url  = `${provider.baseURL}${provider.prefix}/categories/all`;
                axios.get(url,{
                    headers: {
                        token
                    }
                })
                    .then((res)=>{
                        if (res.data.code === 201) {
                            this.tableData = res.data.data;
                        }
                    })

            },
            handleCreateNewCategory(){
                this.$router.push('/categories/add');
            },
            handleClick(row){
                this.$router.push(`/categories/${row._id}/edit`)
            }
        },
        created() {
            this.fetchAllCategory();
        }
    }
</script>