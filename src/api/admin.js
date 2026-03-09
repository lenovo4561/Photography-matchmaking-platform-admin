import request from "@/utils/request";

// ==================== 仪表盘 ====================
export function getDashboard() {
  return request({ url: "/api/admin/dashboard", method: "get" });
}

// ==================== 用户管理 ====================
export function getUsers(params) {
  return request({ url: "/api/admin/users", method: "get", params });
}

export function banUser(id, data) {
  return request({ url: `/api/admin/users/${id}/ban`, method: "put", data });
}

// ==================== 摄影师管理 ====================
export function getPhotographers(params) {
  return request({ url: "/api/admin/photographers", method: "get", params });
}

export function approvePhotographer(id) {
  return request({
    url: `/api/admin/photographers/${id}/approve`,
    method: "put",
  });
}

export function rejectPhotographer(id, data) {
  return request({
    url: `/api/admin/photographers/${id}/reject`,
    method: "put",
    data,
  });
}

// ==================== 内容审核 ====================
export function getPortfolios(params) {
  return request({ url: "/api/admin/portfolios", method: "get", params });
}

export function approvePortfolio(id) {
  return request({ url: `/api/admin/portfolios/${id}/approve`, method: "put" });
}

export function rejectPortfolio(id, data) {
  return request({
    url: `/api/admin/portfolios/${id}/reject`,
    method: "put",
    data,
  });
}

export function getReports(params) {
  return request({ url: "/api/admin/reports", method: "get", params });
}

export function handleReport(id, data) {
  return request({
    url: `/api/admin/reports/${id}/handle`,
    method: "put",
    data,
  });
}

// ==================== 订单管理 ====================
export function getOrders(params) {
  return request({ url: "/api/admin/orders", method: "get", params });
}

export function arbitrateOrder(id, data) {
  return request({
    url: `/api/admin/orders/${id}/arbitrate`,
    method: "put",
    data,
  });
}

// ==================== 财务管理 ====================
export function getWithdrawals(params) {
  return request({ url: "/api/admin/withdrawals", method: "get", params });
}

export function approveWithdrawal(id) {
  return request({
    url: `/api/admin/withdrawals/${id}/approve`,
    method: "put",
  });
}

export function rejectWithdrawal(id, data) {
  return request({
    url: `/api/admin/withdrawals/${id}/reject`,
    method: "put",
    data,
  });
}

// ==================== 分销管理 ====================
export function getDistributors(params) {
  return request({ url: "/api/admin/distributors", method: "get", params });
}
