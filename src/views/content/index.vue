<template>
  <div class="page-container">
    <el-tabs v-model="activeTab" @tab-click="fetchData">
      <el-tab-pane label="作品集审核" name="portfolio" />
      <el-tab-pane label="侵权举报" name="report" />
    </el-tabs>

    <!-- 作品集审核 -->
    <template v-if="activeTab === 'portfolio'">
      <div class="filter-bar">
        <el-select
          v-model="pQuery.status"
          placeholder="状态"
          clearable
          style="width: 130px"
          @change="fetchPortfolios"
        >
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已下架" value="rejected" />
        </el-select>
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="fetchPortfolios"
          >刷新</el-button
        >
      </div>
      <el-table :data="portfolios" border stripe v-loading="pLoading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="封面" width="90">
          <template slot-scope="{ row }">
            <img
              v-if="row.cover"
              :src="row.cover"
              style="
                width: 70px;
                height: 50px;
                object-fit: cover;
                border-radius: 4px;
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="摄影师" width="120">
          <template slot-scope="{ row }">{{
            row.Photographer &&
            row.Photographer.User &&
            row.Photographer.User.nickname
          }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="pStatusType(row.status)" size="small">{{
              pStatusLabel(row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="success" size="mini" @click="approveP(row)"
                >通过</el-button
              >
              <el-button type="danger" size="mini" @click="rejectP(row)"
                >下架</el-button
              >
            </template>
            <span v-else style="color: #999">已处理</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 16px; text-align: right"
        :current-page="pQuery.page"
        :page-size="pQuery.limit"
        :total="pTotal"
        layout="total, prev, pager, next"
        @current-change="
          (p) => {
            pQuery.page = p;
            fetchPortfolios();
          }
        "
      />
    </template>

    <!-- 侵权举报 -->
    <template v-if="activeTab === 'report'">
      <el-table :data="reports" border stripe v-loading="rLoading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="reason" label="举报原因" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.status === 'handled' ? 'success' : 'warning'"
              size="small"
              >{{ row.status === "handled" ? "已处理" : "待处理" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.status !== 'handled'"
              type="primary"
              size="mini"
              @click="handleRpt(row)"
              >处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 下架理由弹窗 -->
    <el-dialog title="填写下架理由" :visible.sync="rejectDialog" width="400px">
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
  getPortfolios,
  approvePortfolio,
  rejectPortfolio,
  getReports,
  handleReport,
} from "@/api/admin";

export default {
  name: "ContentAudit",
  data() {
    return {
      activeTab: "portfolio",
      portfolios: [],
      pTotal: 0,
      pLoading: false,
      pQuery: { status: "pending", page: 1, limit: 20 },
      reports: [],
      rLoading: false,
      rejectDialog: false,
      rejectReason: "",
      currentRow: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.activeTab === "portfolio"
        ? this.fetchPortfolios()
        : this.fetchReports();
    },
    async fetchPortfolios() {
      this.pLoading = true;
      const res = await getPortfolios(this.pQuery).catch(() => {});
      if (res) {
        this.portfolios = res.data.list || [];
        this.pTotal = res.data.total || 0;
      }
      this.pLoading = false;
    },
    async fetchReports() {
      this.rLoading = true;
      const res = await getReports({ page: 1, limit: 50 }).catch(() => {});
      if (res) this.reports = res.data.list || [];
      this.rLoading = false;
    },
    async approveP(row) {
      await approvePortfolio(row.id);
      row.status = "approved";
      this.$message.success("已通过");
    },
    rejectP(row) {
      this.currentRow = row;
      this.rejectReason = "";
      this.rejectDialog = true;
    },
    async confirmReject() {
      if (!this.rejectReason) {
        this.$message.warning("请填写理由");
        return;
      }
      await rejectPortfolio(this.currentRow.id, { reason: this.rejectReason });
      this.currentRow.status = "rejected";
      this.rejectDialog = false;
      this.$message.success("已下架");
    },
    async handleRpt(row) {
      await this.$confirm("确认处理该举报？", "提示", { type: "warning" });
      await handleReport(row.id, { result: "handled" });
      row.status = "handled";
      this.$message.success("已处理");
    },
    pStatusType(s) {
      return (
        { approved: "success", pending: "warning", rejected: "danger" }[s] ||
        "info"
      );
    },
    pStatusLabel(s) {
      return (
        { approved: "已通过", pending: "待审核", rejected: "已下架" }[s] || s
      );
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
