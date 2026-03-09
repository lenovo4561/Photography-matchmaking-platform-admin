<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-input
        v-model="query.keyword"
        placeholder="搜索手机号/昵称"
        clearable
        style="width: 200px"
        @clear="fetchData"
      />
      <el-button type="primary" style="margin-left: 10px" @click="fetchData"
        >搜索</el-button
      >
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="推广员" width="150">
        <template slot-scope="{ row }">
          <div>{{ row.User && row.User.nickname }}</div>
          <div style="color: #999; font-size: 12px">
            {{ row.User && row.User.phone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="inviteCode" label="邀请码" width="120" />
      <el-table-column prop="level" label="等级" width="80">
        <template slot-scope="{ row }">
          <el-tag
            size="small"
            :type="
              ['', 'info', 'warning', 'success', 'danger'][row.level] || 'info'
            "
            >L{{ row.level }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="totalInvite" label="邀请人数" width="100" />
      <el-table-column prop="totalCommission" label="总佣金(元)" width="120" />
      <el-table-column
        prop="availableBalance"
        label="可提现余额(元)"
        width="130"
      />
      <el-table-column prop="createdAt" label="加入时间" width="165">
        <template slot-scope="{ row }">{{
          formatDate(row.createdAt)
        }}</template>
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
  </div>
</template>

<script>
import { getDistributors } from "@/api/admin";

export default {
  name: "DistributorManage",
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      query: { keyword: "", page: 1, limit: 20 },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const res = await getDistributors(this.query).catch(() => {});
      if (res) {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
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
