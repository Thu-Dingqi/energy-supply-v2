// app/api/download-file/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');
  
  if (!filename) {
    return new NextResponse('Filename is required', { status: 400 });
  }

  // 验证文件名以防止目录遍历攻击
  const validFilenames = ['nation_results.xlsx', '30PE_Results_ALL.xlsx'];
  if (!validFilenames.includes(filename)) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  // 使用相对路径获取文件
  const filePath = path.join(process.cwd(), 'data', 'excel', 'json', filename);
  
  try {
    // 检查文件是否存在
    const stats = await fs.promises.stat(filePath);
    if (!stats.isFile()) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 读取文件
    const fileData = await fs.promises.readFile(filePath);
    
    // 设置适当的响应头，用于Excel文件
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Error serving file', { status: 500 });
  }
}