#!/bin/bash

# 定义颜色代码
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# 检查PM2是否已安装
check_pm2() {
  echo -e "${YELLOW}检查PM2安装状态...${NC}"
  if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2未安装,正在全局安装PM2...${NC}"
    npm install -g pm2
    if [ $? -ne 0 ]; then
      echo -e "${RED}PM2安装失败,请手动安装后重试${NC}"
      exit 1
    else
      echo -e "${GREEN}PM2安装成功!${NC}"
    fi
  else
    echo -e "${GREEN}PM2已安装!${NC}"
  fi
}

# 检查Node.js和npm
check_node() {
  echo -e "${YELLOW}检查Node.js和npm...${NC}"
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js未安装,请先安装Node.js${NC}"
    exit 1
  fi
  
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm未安装,请先安装npm${NC}"
    exit 1
  fi
  
  # 检查Node.js版本
  node_version=$(node -v | cut -d 'v' -f 2)
  required_version="14.0.0"
  
  if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo -e "${RED}Node.js版本太低,需要v14.0.0或更高版本${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Node.js和npm检查通过!${NC}"
}

# 安装依赖
install_dependencies() {
  echo -e "${YELLOW}安装项目依赖...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}依赖安装失败,请检查网络连接后重试${NC}"
    exit 1
  else
    echo -e "${GREEN}依赖安装成功!${NC}"
  fi
}

# 创建日志目录
create_logs_dir() {
  echo -e "${YELLOW}创建日志目录...${NC}"
  mkdir -p logs
  echo -e "${GREEN}日志目录创建完成!${NC}"
}

# 构建客户端
build_client() {
  echo -e "${YELLOW}构建客户端...${NC}"
  npm run build
  if [ $? -ne 0 ]; then
    echo -e "${RED}客户端构建失败,请检查项目配置${NC}"
    exit 1
  else
    echo -e "${GREEN}客户端构建成功!${NC}"
  fi
}

# 使用PM2启动服务
start_service() {
  echo -e "${YELLOW}正在启动服务...${NC}"
  # 确保使用IPv4地址 - 在服务器参数中明确指定
  export NODE_OPTIONS="--dns-result-order=ipv4first"
  
  # 使用pm2的ecosystem配置文件
  if [ -f "ecosystem.config.js" ]; then
    echo -e "${BLUE}检测到ecosystem.config.js,使用配置文件启动...${NC}"
    pm2 restart ecosystem.config.js
  else
    echo -e "${BLUE}未检测到配置文件,使用默认配置启动...${NC}"
    # 确保使用IPv4地址
    pm2 start server.js --name "onething" -o logs/app-out.log -e logs/app-error.log --max-memory-restart 512M
  fi
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}服务启动失败,请检查日志文件${NC}"
    exit 1
  else
    echo -e "${GREEN}服务启动成功!${NC}"
    pm2 save
    echo -e "${GREEN}PM2配置已保存,系统重启后服务将自动启动${NC}"
  fi
}

# 检查服务状态
check_service() {
  echo -e "${YELLOW}检查服务状态...${NC}"
  pm2 list | grep onething
  
  # 使用curl检查API健康状况
  sleep 2
  echo -e "${YELLOW}检查API健康状况...${NC}"
  curl -s http://localhost:5005/api/health || echo -e "${RED}API服务未响应,请检查服务日志${NC}"
}

# 显示帮助信息
show_help() {
  echo -e "${BLUE}OneThing 服务启动脚本${NC}"
  echo ""
  echo -e "用法: ./start.sh [选项]"
  echo ""
  echo -e "选项:"
  echo -e "  -i, --install      仅安装依赖"
  echo -e "  -b, --build        仅构建客户端"
  echo -e "  -s, --start        仅启动服务"
  echo -e "  -r, --restart      重启服务"
  echo -e "  -c, --check        检查服务状态"
  echo -e "  -h, --help         显示此帮助信息"
  echo ""
  echo -e "没有参数时,将执行完整的安装、构建和启动流程"
}

# 主函数
main() {
  # 如果没有参数,执行完整流程
  if [ $# -eq 0 ]; then
    check_node
    check_pm2
    install_dependencies
    create_logs_dir
    build_client
    start_service
    check_service
    exit 0
  fi
  
  # 解析命令行参数
  case "$1" in
    -i|--install)
      check_node
      install_dependencies
      ;;
    -b|--build)
      build_client
      ;;
    -s|--start)
      check_pm2
      create_logs_dir
      start_service
      check_service
      ;;
    -r|--restart)
      check_pm2
      pm2 restart onething
      check_service
      ;;
    -c|--check)
      check_service
      ;;
    -h|--help)
      show_help
      ;;
    *)
      echo -e "${RED}未知选项: $1${NC}"
      show_help
      exit 1
      ;;
  esac
}

# 执行主函数
main "$@" 