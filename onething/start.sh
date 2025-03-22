#!/bin/bash

# 颜色定义
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# 显示带颜色的消息
log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# 检查MongoDB是否已启动
check_mongodb() {
  log_info "检查MongoDB状态..."
  if mongo --eval "db.version()" >/dev/null 2>&1; then
    log_info "MongoDB已启动"
    return 0
  else
    log_warn "MongoDB未启动或无法连接。应用将使用内存存储模式。"
    return 1
  fi
}

# 检查nodemon是否安装
if ! command -v nodemon &> /dev/null; then
  log_info "安装nodemon..."
  npm install -g nodemon
fi

# 安装依赖
log_info "安装依赖..."
npm install

# 创建日志目录
mkdir -p logs

# 检查MongoDB状态
check_mongodb

# 启动后端服务器
log_info "启动后端服务器..."
nodemon --ignore 'src/*' server.js > logs/server.log 2>&1 &
SERVER_PID=$!

# 检查服务器是否成功启动
sleep 2
if ! ps -p $SERVER_PID > /dev/null; then
  log_error "后端服务器启动失败，查看日志: logs/server.log"
  tail -n 10 logs/server.log
else
  log_info "后端服务器启动成功 (PID: $SERVER_PID)"
fi

# 启动前端开发服务器
log_info "启动前端开发服务器..."
BROWSER=none npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# 检查前端服务器是否成功启动
sleep 5
if ! ps -p $FRONTEND_PID > /dev/null; then
  log_error "前端服务器启动失败，查看日志: logs/frontend.log"
  tail -n 10 logs/frontend.log
else
  log_info "前端服务器启动成功 (PID: $FRONTEND_PID)"
fi

# 捕获CTRL+C信号
trap "log_info '正在停止服务...'; kill $SERVER_PID $FRONTEND_PID 2>/dev/null; exit" INT

# 等待
log_info "服务已启动"
echo -e "前端: ${GREEN}http://localhost:3000${NC}"
echo -e "后端: ${GREEN}http://localhost:4000/graphql${NC}"
echo -e "API健康检查: ${GREEN}http://localhost:4000/api/health${NC}"
echo -e "${YELLOW}按CTRL+C停止所有服务${NC}"

# 开启浏览器
if command -v open &> /dev/null; then
  open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000
fi

# 监控服务状态
while true; do
  if ! ps -p $SERVER_PID > /dev/null || ! ps -p $FRONTEND_PID > /dev/null; then
    log_error "检测到服务中断，正在重启..."
    
    # 尝试终止现有进程
    kill $SERVER_PID $FRONTEND_PID 2>/dev/null
    
    # 重启服务
    nodemon --ignore 'src/*' server.js > logs/server.log 2>&1 &
    SERVER_PID=$!
    BROWSER=none npm start > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    log_info "服务已重启"
  fi
  
  sleep 10
done 