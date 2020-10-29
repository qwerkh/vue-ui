<template>
  <el-col :span="24">
    <el-row>
      <el-button icon="el-icon-plus" type="primary" @click="handleGotoCreateUser">Create User</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="tableData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
        @row-click="handleClick"
      >
        <el-table-column label="Username" prop="username"></el-table-column>
        <el-table-column label="Created At">
          <template slot-scope="scope">{{scope.row.createdAt | moment("DD/MM/YYYY HH:mm")}}</template>
        </el-table-column>
        <el-table-column label="Status">
          <template
            slot-scope="scope"
          >{{scope.row.profile.approved ? "Allow" : "Not Allow"}}</template>
        </el-table-column>
        <el-table-column label="Role">
          <template slot-scope="scope">{{scope.row.roles}}</template>
        </el-table-column>
        <el-table-column label="Store">
          <template slot-scope="scope">{{scope.row.stores.map(map => map.name)}}</template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="small" placeholder="Find accounts...."/>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- Diaglog form -->
  </el-col>
</template>

<script>
import {provider} from "../../service/provider";
import axios from "axios";
export default {
  data() {
    return {
        dialogFormVisible: false,
        
      search: "",
      select: "",
      tableData: []
    };
  },
  methods: {
    handleGotoCreateUser(){
       this.$router.push('/users/add')
    },
    fetchUsers() {
      const { token, user } = this.$store.state.user;
      const url = `${provider.baseURL}/user/fetch_all`;

      axios
        .post(
          `${url}`,
          { _id: user._id },
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
            this.tableData = data.data;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleClick(row) {
      const {  user } = this.$store.state.user;
      if(provider.isAdmin(user.roles) || provider.isSuper(user.roles) || provider.isGM(user.roles)){
        this.$router.push(`/users/${row._id}/edit`);
      }
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>