<template>
  <div class="page-container">
    <div class="filter-bar">
      <el-select
        v-model="query.certStatus"
        placeholder="审核状态"
        clearable
        style="width: 140px"
        @change="fetchData"
      >
        <el-option label="待审核" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-input
        v-model="query.keyword"
        placeholder="搜索名称/城市"
        clearable
        style="width: 200px; margin-left: 10px"
        @clear="fetchData"
      />
      <el-button type="primary" style="margin-left: 10px" @click="fetchData"
        >搜索</el-button
      >
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="用户" width="140">
        <template slot-scope="{ row }">
          <div>{{ row.User && row.User.nickname }}</div>
          <div style="color: #999; font-size: 12px">
            {{ row.User && row.User.phone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="100" />
      <el-table-column prop="styleTags" label="风格" width="150">
        <template slot-scope="{ row }">
          <el-tag
            v-for="t in (row.styleTags || []).slice(0, 3)"
            :key="t"
            size="mini"
            style="margin: 2px"
            >{{ t }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="certStatus" label="认证状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="statusType(row.certStatus)" size="small">{{
            statusLabel(row.certStatus)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="认证材料" width="100">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.certImages && row.certImages.length"
            type="text"
            @click="previewImages(row.certImages)"
            >查看</el-button
          >
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <template v-if="row.certStatus === 'pending'">
            <el-button type="success" size="mini" @click="approve(row)"
              >通过</el-button
            >
            <el-button type="danger" size="mini" @click="reject(row)"
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

    <!-- 拒绝理由弹窗 -->
    <el-dialog title="填写拒绝理由" :visible.sync="rejectDialog" width="400px">
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="4"
        placeholder="请填写拒绝理由..."
      />
      <span slot="footer">
        <el-button @click="rejectDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确认拒绝</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog title="认证材料" :visible.sync="imgDialog" width="600px">
      <div v-for="(img, i) in previewList" :key="i" style="margin-bottom: 10px">
        <img :src="img" style="max-width: 100%; border-radius: 4px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPhotographers,
  approvePhotographer,
  rejectPhotographer,
} from "@/api/admin";

export default {
  name: "PhotographerManage",
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      query: { certStatus: "pending", keyword: "", page: 1, limit: 20 },
      rejectDialog: false,
      rejectReason: "",
      currentRow: null,
      imgDialog: false,
      previewList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const res = await getPhotographers(this.query).catch(() => {});
      if (res) {
        this.list = res.data.list || [];
        this.total = res.data.total || 0;
      }
      this.loading = false;
    },
    async approve(row) {
      await this.$confirm(
        `确认通过【${row.User && row.User.nickname}】的摄影师认证？`,
        "提示",
        { type: "warning" }
      );
      await approvePhotographer(row.id);
      row.certStatus = "approved";
      this.$message.success("已通过");
    },
    reject(row) {
      this.currentRow = row;
      this.rejectReason = "";
      this.rejectDialog = true;
    },
    async confirmReject() {
      if (!this.rejectReason) {
        this.$message.warning("请填写拒绝理由");
        return;
      }
      await rejectPhotographer(this.currentRow.id, {
        reason: this.rejectReason,
      });
      this.currentRow.certStatus = "rejected";
      this.rejectDialog = false;
      this.$message.success("已拒绝");
    },
    previewImages(imgs) {
      this.previewList = imgs;
      this.imgDialog = true;
    },
    statusType(s) {
      return (
        { approved: "success", pending: "warning", rejected: "danger" }[s] ||
        "info"
      );
    },
    statusLabel(s) {
      return (
        { approved: "已通过", pending: "待审核", rejected: "已拒绝" }[s] || s
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
