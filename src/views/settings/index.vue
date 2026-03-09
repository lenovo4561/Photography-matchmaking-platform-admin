<template>
  <div class="page-container">
    <h3 class="section-title">平台基础配置</h3>
    <el-form :model="form" label-width="180px" style="max-width: 600px">
      <el-form-item label="平台抽成比例 L1 (%)">
        <el-input-number
          v-model="form.feeRateL1"
          :min="0"
          :max="100"
          :precision="1"
          :step="0.5"
        />
      </el-form-item>
      <el-form-item label="平台抽成比例 L2 (%)">
        <el-input-number
          v-model="form.feeRateL2"
          :min="0"
          :max="100"
          :precision="1"
          :step="0.5"
        />
      </el-form-item>
      <el-form-item label="平台抽成比例 L3 (%)">
        <el-input-number
          v-model="form.feeRateL3"
          :min="0"
          :max="100"
          :precision="1"
          :step="0.5"
        />
      </el-form-item>
      <el-form-item label="平台抽成比例 L4 (%)">
        <el-input-number
          v-model="form.feeRateL4"
          :min="0"
          :max="100"
          :precision="1"
          :step="0.5"
        />
      </el-form-item>
      <el-divider />
      <el-form-item label="分销佣金比例 (%)">
        <el-input-number
          v-model="form.distributorRate"
          :min="0"
          :max="50"
          :precision="1"
          :step="0.5"
        />
      </el-form-item>
      <el-form-item label="自动确认天数 (天)">
        <el-input-number v-model="form.autoConfirmDays" :min="1" :max="30" />
      </el-form-item>
      <el-form-item label="结算周期 (天)">
        <el-input-number v-model="form.settleDays" :min="1" :max="30" />
      </el-form-item>
      <el-form-item label="最低提现金额 (元)">
        <el-input-number
          v-model="form.minWithdrawAmount"
          :min="1"
          :max="1000"
        />
      </el-form-item>
      <el-divider />
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="saveSettings"
          >保 存</el-button
        >
        <el-button @click="resetForm">重 置</el-button>
      </el-form-item>
    </el-form>

    <h3 class="section-title" style="margin-top: 40px">当前默认值</h3>
    <table class="desc-table">
      <tbody>
        <tr>
          <th>L1抽成</th>
          <td>15%</td>
          <th>L2抽成</th>
          <td>10%</td>
        </tr>
        <tr>
          <th>L3抽成</th>
          <td>8%</td>
          <th>L4抽成</th>
          <td>5%</td>
        </tr>
        <tr>
          <th>分销佣金</th>
          <td>5%</td>
          <th>自动确认</th>
          <td>7天</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      saving: false,
      form: {
        feeRateL1: 15,
        feeRateL2: 10,
        feeRateL3: 8,
        feeRateL4: 5,
        distributorRate: 5,
        autoConfirmDays: 7,
        settleDays: 7,
        minWithdrawAmount: 50,
      },
      original: {},
    };
  },
  created() {
    this.original = { ...this.form };
  },
  methods: {
    async saveSettings() {
      this.saving = true;
      await new Promise((r) => setTimeout(r, 500)); // 模拟保存
      this.$message.success("配置已保存（后端实现后生效）");
      this.saving = false;
    },
    resetForm() {
      this.form = { ...this.original };
    },
  },
};
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.section-title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: 600;
}
.desc-table {
  border-collapse: collapse;
  border: 1px solid #ebeef5;
  font-size: 14px;
  color: #606266;
}
.desc-table th,
.desc-table td {
  border: 1px solid #ebeef5;
  padding: 10px 18px;
}
.desc-table th {
  background-color: #fafafa;
  font-weight: 600;
  color: #909399;
}
</style>
