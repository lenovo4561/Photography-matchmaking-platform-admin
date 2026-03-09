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
      <el-select
        v-model="query.status"
        placeholder="状态"
        clearable
        style="width: 120px; margin-left: 10px"
        @change="fetchData"
      >
        <el-option label="正常" value="active" />
        <el-option label="已封禁" value="banned" />
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="fetchData"
        >搜索</el-button
      >
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="currentRole" label="当前身份" width="100">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.currentRole === 'photographer' ? 'success' : 'info'"
            size="small"
          >
            {{ row.currentRole === "photographer" ? "摄影师" : "需求方" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="realnameStatus" label="实名状态" width="100">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.realnameStatus === 'verified' ? 'success' : 'warning'"
            size="small"
          >
            {{ row.realnameStatus === "verified" ? "已实名" : "未实名" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间" width="165">
        <template slot-scope="{ row }">{{
          formatDate(row.createdAt)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button
            :type="row.status === 'banned' ? 'success' : 'danger'"
            size="mini"
            @click="toggleBan(row)"
            >{{ row.status === "banned" ? "解封" : "封号" }}</el-button
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
  </div>
</template>

<script>
import { getUsers, banUser } from "@/api/admin";

export default {
  name: "UserManage",
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      query: { keyword: "", status: "", page: 1, limit: 20 },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const res = await getUsers(this.query).catch(() => {});
      if (res) {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    async toggleBan(row) {
      const isBanned = row.status === "banned";
      await this.$confirm(
        `确认${isBanned ? "解封" : "封号"}用户【${
          row.nickname || row.phone
        }】？`,
        "提示",
        { type: "warning" }
      );
      await banUser(row.id, { banned: !isBanned });
      row.status = isBanned ? "active" : "banned";
      this.$message.success("操作成功");
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
