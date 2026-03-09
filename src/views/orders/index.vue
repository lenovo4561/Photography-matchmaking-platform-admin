<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-select
        v-model="query.status"
        placeholder="订单状态"
        clearable
        style="width: 140px"
        @change="fetchData"
      >
        <el-option
          v-for="s in statusOpts"
          :key="s.val"
          :label="s.label"
          :value="s.val"
        />
      </el-select>
      <el-input
        v-model="query.keyword"
        placeholder="搜索订单号"
        clearable
        style="width: 200px; margin-left: 10px"
        @clear="fetchData"
      />
      <el-button type="primary" style="margin-left: 10px" @click="fetchData"
        >搜索</el-button
      >
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="orderNo" label="订单号" width="180" />
      <el-table-column label="服务" width="150">
        <template slot-scope="{ row }">{{
          row.Service && row.Service.title
        }}</template>
      </el-table-column>
      <el-table-column label="买家" width="100">
        <template slot-scope="{ row }">{{
          row.Buyer && row.Buyer.nickname
        }}</template>
      </el-table-column>
      <el-table-column label="摄影师" width="100">
        <template slot-scope="{ row }">
          {{
            row.Photographer &&
            row.Photographer.User &&
            row.Photographer.User.nickname
          }}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额(元)" width="100" />
      <el-table-column prop="status" label="状态" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="orderStatusType(row.status)" size="small">{{
            orderStatusLabel(row.status)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="下单时间" width="165">
        <template slot-scope="{ row }">{{
          formatDate(row.createdAt)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status === 'refunding'"
            type="warning"
            size="mini"
            @click="openArbitrate(row)"
            >仲裁</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 16px; text-align: right"
      :current-page="query.page"
      :page-size="query.limit"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="
        (p) => {
          query.page = p;
          fetchData();
        }
      "
    />

    <!-- 仲裁弹窗 -->
    <el-dialog title="仲裁处理" :visible.sync="arbitrateDialog" width="420px">
      <p>订单号：{{ currentRow && currentRow.orderNo }}</p>
      <el-radio-group v-model="arbitrateResult" style="margin: 16px 0">
        <el-radio label="refund">同意退款</el-radio>
        <el-radio label="reject">拒绝退款</el-radio>
      </el-radio-group>
      <el-input
        v-model="arbitrateRemark"
        type="textarea"
        :rows="3"
        placeholder="仲裁说明..."
      />
      <span slot="footer">
        <el-button @click="arbitrateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmArbitrate">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, arbitrateOrder } from "@/api/admin";

export default {
  name: "OrderManage",
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      query: { status: "", keyword: "", page: 1, limit: 20 },
      statusOpts: [
        { val: "pending", label: "待接单" },
        { val: "confirmed", label: "已接单" },
        { val: "shooting", label: "拍摄中" },
        { val: "delivered", label: "已交付" },
        { val: "completed", label: "已完成" },
        { val: "cancelled", label: "已取消" },
        { val: "refunding", label: "退款中" },
        { val: "refunded", label: "已退款" },
      ],
      arbitrateDialog: false,
      arbitrateResult: "refund",
      arbitrateRemark: "",
      currentRow: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const res = await getOrders(this.query).catch(() => {});
      if (res) {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    openArbitrate(row) {
      this.currentRow = row;
      this.arbitrateResult = "refund";
      this.arbitrateRemark = "";
      this.arbitrateDialog = true;
    },
    async confirmArbitrate() {
      if (!this.arbitrateRemark) {
        this.$message.warning("请填写仲裁说明");
        return;
      }
      await arbitrateOrder(this.currentRow.id, {
        result: this.arbitrateResult,
        remark: this.arbitrateRemark,
      });
      this.arbitrateDialog = false;
      this.$message.success("仲裁完成");
      this.fetchData();
    },
    orderStatusType(s) {
      const map = {
        pending: "warning",
        confirmed: "primary",
        shooting: "primary",
        delivered: "success",
        completed: "success",
        cancelled: "info",
        refunding: "danger",
        refunded: "info",
      };
      return map[s] || "info";
    },
    orderStatusLabel(s) {
      const map = {
        pending: "待接单",
        confirmed: "已接单",
        shooting: "拍摄中",
        delivered: "已交付",
        completed: "已完成",
        cancelled: "已取消",
        refunding: "退款中",
        refunded: "已退款",
      };
      return map[s] || s;
    },
    formatDate(d) {
      return d ? new Date(d).toLocaleString("zh-CN") : "-";
    },
  },
};
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.filter-bar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
</style>
