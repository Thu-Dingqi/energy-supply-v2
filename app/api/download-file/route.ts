import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');
  
  if (!filename) {
    return new NextResponse('Filename is required', { status: 400 });
  }

  // Validate the filename to avoid directory traversal attacks
  const validFilenames = ['nation_results.xlsx', '30PE_Results_ALL.xlsx'];
  if (!validFilenames.includes(filename)) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  // Use relative path to the file
  const filePath = path.join(process.cwd(), 'data', 'excel', 'json', filename);
  
  try {
    // Check if file exists
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) {
      return new NextResponse('Not a file', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Set appropriate headers for Excel file
    const headers = new Headers();
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Length', stats.size.toString());
    
    // Return the file
    return new NextResponse(fileBuffer, { 
      status: 200,
      headers
    });
  } catch (error: any) {
    console.error('Error serving file:', error);
    return new NextResponse(`Error serving file: ${error.message}`, { status: 500 });
  }
}