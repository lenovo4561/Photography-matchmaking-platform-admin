<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-select
        v-model="query.status"
        placeholder="状态"
        clearable
        style="width: 140px"
        @change="fetchData"
      >
        <el-option label="待审核" value="pending" />
        <el-option label="已批准" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="fetchData"
        >刷新</el-button
      >
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="申请人" width="120">
        <template slot-scope="{ row }">{{
          row.User && (row.User.nickname || row.User.phone)
        }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="申请金额(元)" width="130" />
      <el-table-column prop="channel" label="提现渠道" width="110">
        <template slot-scope="{ row }">
          {{
            { alipay: "支付宝", wechat: "微信", bank: "银行卡" }[row.channel] ||
            row.channel
          }}
        </template>
      </el-table-column>
      <el-table-column prop="accountInfo" label="收款账户" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag
            :type="
              { pending: 'warning', approved: 'success', rejected: 'danger' }[
                row.status
              ] || 'info'
            "
            size="small"
          >
            {{
              { pending: "待审核", approved: "已批准", rejected: "已拒绝" }[
                row.status
              ] || row.status
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="申请时间" width="165">
        <template slot-scope="{ row }">{{
          formatDate(row.createdAt)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <template v-if="row.status === 'pending'">
            <el-button type="success" size="mini" @click="approve(row)"
              >批准</el-button
            >
            <el-button type="danger" size="mini" @click="openReject(row)"
              >拒绝</el-button
            >
          </template>
          <span v-else style="color: #999">已处理</span>
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

    <el-dialog title="填写拒绝理由" :visible.sync="rejectDialog" width="400px">
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="3"
        placeholder="请填写理由..."
      />
      <span slot="footer">
        <el-button @click="rejectDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "@/api/admin";

export default {
  name: "FinanceManage",
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      query: { status: "pending", page: 1, limit: 20 },
      rejectDialog: false,
      rejectReason: "",
      currentRow: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const res = await getWithdrawals(this.query).catch(() => {});
      if (res) {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    async approve(row) {
      await this.$confirm(`确认批准 ¥${row.amount} 的提现申请？`, "提示", {
        type: "warning",
      });
      await approveWithdrawal(row.id);
      row.status = "approved";
      this.$message.success("已批准");
    },
    openReject(row) {
      this.currentRow = row;
      this.rejectReason = "";
      this.rejectDialog = true;
    },
    async confirmReject() {
      if (!this.rejectReason) {
        this.$message.warning("请填写理由");
        return;
      }
      await rejectWithdrawal(this.currentRow.id, { reason: this.rejectReason });
      this.currentRow.status = "rejected";
      this.rejectDialog = false;
      this.$message.success("已拒绝");
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
