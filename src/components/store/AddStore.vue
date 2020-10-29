<template>
  <transition name="el-zoom-in-top">
    <el-row :gutter="20" v-show="true">
      <el-col :span="12">
        <el-form :model="storeForm" :rules="rules" ref="store">
          <div class="card-box first-margin">
            <div class="card-header">
              <h5>បង្កើតហាងថ្មី</h5>
              <p>សូមបំពេញតារាងខាងក្រោម</p>
            </div>
            <div class="card-body">
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="ឈ្មោះសាខាហាង" prop="name">
                    <el-input v-model="storeForm.name" placeholder="Thecake tuol kok"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="ឈ្មោះកាត់បីតួ" prop="shortcutName">
                    <el-input v-model="storeForm.shortcutName" placeholder="BKK"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="អាស័យដ្ឋាន" prop="address">
                    <el-input type="textarea" v-model="storeForm.address" rows="3"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="ពិពណ៌នា">
                    <el-input type="textarea" v-model="storeForm.desc" rows="3"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-col :span="8">
                    <el-form-item>
                      <el-checkbox v-model="storeForm.closeOrder">បិទការកម្ម៉ង់ទិញ</el-checkbox>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="card-box lmargin">
            <div class="card-header">
              <el-row>
                <el-col :span="24">
                  <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    list-type="picture"
                  >
                    <el-button size="mini" type="primary">ដាក់រូបភាពសម្រាប់ហាង</el-button>
                    <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                  </el-upload>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="card-button first-margin">
              <div class="card-header">
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">រក្សាទុក</el-button>
            </el-form-item>
          </el-row>
          </div>
          </div>
        </el-form>
      </el-col>
      <el-col :span="12">
        <google-map/>
      </el-col>
    </el-row>
  </transition>
</template>
<script>
import GoogleMap from "@/components/GoogleMap";
import { provider } from "@/service/provider";
import axios from "axios";

export default {
  components: {
    GoogleMap
  },
  data() {
    return {
      storeId: null,
      fileList: [],
      options: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: true
      },
      storeForm: {
        closeOrder: false,
        name: "",
        desc: "",
        shortcutName: "",
        address: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "តម្រូវអោយបំពេញ",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "តម្រូវអោយបំពេញ",
            trigger: "blur"
          }
        ],
        shortcutName: [
          {
            required: true,
            message: "តម្រូវអោយបំពេញ",
            trigger: "blur"
          },
          {
            min: 1,
            max: 3,
            message: "Length should be 1 to 3",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handlePreview() {},
    handleRemove() {},
    onSubmit() {
      this.$refs["store"].validate(valid => {
        if (valid) {
          const { token, user } = this.$store.state.user;
          const url = !this.storeId
            ? `${provider.baseURL}${provider.prefix}/store/add`
            : `${provider.baseURL}${provider.prefix}/store/${
                this.storeId
              }/edit`;
          this.storeForm.createdBy = user._id;
          console.log(url);
          axios
            .post(`${url}`, this.storeForm, {
              headers: {
                token: token
              }
            })
            .then(response => {
              const data = response.data;
              if (data.code == 403) {
                this.$message.error(data.message);
              } else {
                if (this.storeId) {
                  this.$message.success("កែប្រែបានជោគជ័យ");
                  this.$router.push("/stores");
                } else {
                  this.$message.success("បង្កើតហាងបានជោគជ័យ");
                  Object.assign(this.$data, this.$options.data.apply(this));
                }
                //clear property after success
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    fetchStore(id) {
      const { token, user } = this.$store.state.user;
      const url = `${provider.baseURL}${provider.prefix}/store/${id}`;
      axios
        .post(
          url,
          { requestId: user._id },
          {
            headers: {
              token
            }
          }
        )
        .then(res => {
          if (res.data.code === 201) {
            this.storeId = res.data.data._id;
            for (let k in this.storeForm) {
              this.storeForm[k] = res.data.data[k];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    const { id } = this.$route.params;
    if (!!id) {
      this.fetchStore(id);
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Battambang|Bokor|Chenla|Kantumruy|Kdam+Thmor|Khmer|Nokora|Odor+Mean+Chey|Roboto|Taprom");

body {
  font-family: "Chenla", "Roboto", cursive;
}

.card-box {
  transition: box-shadow ease 0.2s;
  box-shadow: 0 25px 50px rgba(8, 21, 66, 0.06);
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: border-box;
  .card-header {
    margin-bottom: 0;
    padding: 0.75rem 1.25rem;
    color: inherit;
    border-bottom: 0 solid rgba(0, 0, 0, 0.125);
    background-color: transparent;
    h5 {
      font-size: 1.125rem;
      margin: 0px;
      font-family: "Chenla", "Roboto", cursive;
      font-weight: bold;
    }
    p {
      color: #8492a6 !important;
      font-style: italic;
      margin: 0;
      font-size: 0.925rem;
    }
  }
  .card-body {
    padding: 0.75rem 1.25rem;
  }
}

.card-button{
      transition: box-shadow ease 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  .card-header {
    margin-bottom: 0;
    padding: 0.75rem 1.25rem;
    color: inherit;
    border-bottom: 0 solid rgba(0, 0, 0, 0.125);
    background-color: transparent;}
}
.first-margin {
  margin: 30px 10px 30px 35px;
}
.second-margin {
  margin: 30px 30px 30px 5px;
}
.lmargin {
  margin: 30px 10px 30px 35px;
}
</style>