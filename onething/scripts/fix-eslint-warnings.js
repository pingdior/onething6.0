#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 修复未使用的导入和变量
console.log('修复未使用的导入和变量...');
try {
  execSync('npx eslint --fix src/**/*.{ts,tsx} --rule "@typescript-eslint/no-unused-vars: error"', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('自动修复部分失败，请查看以下错误:', error.message);
}

// 修复默认导出格式
console.log('修复默认导出格式...');
try {
  execSync('npx eslint --fix src/i18n/locales/*.ts src/services/*.ts --rule "import/no-anonymous-default-export: error"', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('自动修复部分失败，请查看以下错误:', error.message);
}

// 修复无用的转义字符
console.log('修复无用的转义字符...');
try {
  execSync('npx eslint --fix src/services/aiService.ts --rule "no-useless-escape: error"', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('自动修复部分失败，请查看以下错误:', error.message);
}

console.log('修复 React Hooks 依赖项...');
console.log('注意: Hooks依赖项需要手动审查。以下是应该检查的文件:');
console.log('- src/components/common/ServiceStatus.tsx (checkServices)');
console.log('- src/components/layout/ChatSidebar.tsx (testAPIConnection)');

console.log('\n修复完成！请手动检查修改并提交。'); 