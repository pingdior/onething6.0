const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'schema/typeDefs.js',
  'schema/resolvers.js',
  'server.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`缺少文件: ${file}`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('所有必要文件已存在，项目结构正确！');
} else {
  console.error('项目结构不完整，请创建缺失的文件');
  process.exit(1);
} 