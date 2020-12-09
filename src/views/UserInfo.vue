<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">用户名</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="value">{{ username }}</div>
          <!--          <el-input v-model="username" size="medium" :style="inputVisible"></el-input>-->
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">姓名</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="value" :style="textVisible">{{ realname }}</div>
          <el-input v-model="realname" size="medium" :style="inputVisible"></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row></el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">电话</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="value" :style="textVisible">{{ phone }}</div>
          <el-input v-model="phone" size="medium" :style="inputVisible"></el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">地址</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div class="value" :style="textVisible">{{ address }}</div>
          <el-input v-model="address" size="medium" :style="inputVisible"></el-input>
        </div>
      </el-col>
    </el-row>
    <div class="btn-group" style="text-align: center">
      <el-button type="primary" @click="modify" :disabled="!ban">修改</el-button>
      <el-button @click="cancel" :disabled="ban">取消</el-button>
      <el-button @click="save" :disabled="ban">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data() {
    return {
      username: '',
      phone: '',
      realname: '',
      address: '',
      phoneCache: '',
      realnameCache: '',
      addressCache: '',
      inputVisible: {
        display: 'none',
      },
      textVisible: {
        display: 'inline',
      },
      ban: true,
    }
  },
  created() {
    const url = "http://localhost:8081/user/userInfo"
    let formData = new FormData();
    formData.append("id", localStorage.getItem("id"));
    const that = this;
    axios.post(url, formData).then(function (res) {
      that.username = res.data[0].username
      that.realname = res.data[0].realname
      that.phone = res.data[0].phone
      that.address = res.data[0].address
      console.log(res.data[0].username)
    }).catch(function (error) {
      console.log(error)
    })
  },
  methods: {

    modify() {
      this.inputVisible.display = "inline"
      this.textVisible.display = "none"
      this.ban = false;
      this.realnameCache = this.realname;
      this.phoneCache = this.phone;
      this.addressCache = this.address;
    },
    cancel() {
      this.realname = this.realnameCache;
      this.phone = this.phoneCache;
      this.address = this.addressCache;

      this.inputVisible.display = "none"
      this.textVisible.display = "inline"
      this.ban = true;
    },
    save() {
      if (!(/^[1][2,3,4,5,7,8,9][0-9]{9}$/.test(this.phone))) {
        this.$message({
          type: "error",
          message: "手机号码格式有误",
        })
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.inputVisible.display = "none"
        this.textVisible.display = "inline"
        this.ban = true;
        const url = 'http://localhost:8081/user/changeUserInfo'
        let formData = new FormData();
        formData.append("realname", this.realname);
        formData.append("phone", this.phone);
        formData.append("address", this.address);
        formData.append("id", localStorage.getItem("id"));
        const that = this;
        axios.post(url, formData).then(function (res) {
          that.$message({
            message: "修改成功",
            type: "success"
          })
          console.log(res)
        }).catch(function (error) {
          console.log(error)
        })
      }, 500);
    },
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
  display: flex;
  justify-content: center;
  align-items: center;
}


.bg-purple-light {
  background: #e5e9f2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

</style>