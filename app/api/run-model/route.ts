import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  const scriptPath = path.join(process.cwd(), 'data', 'excel', 'json', 'result_excel_to_json.py');
  const scriptDir = path.dirname(scriptPath);
  const pythonExecutable = 'python3'; // or 'python' if that's your command

  console.log(`Executing script: ${pythonExecutable} ${scriptPath}`);
  console.log(`Working directory: ${scriptDir}`);

  return new Promise((resolve) => {
    const pythonProcess = spawn(pythonExecutable, [scriptPath], { cwd: scriptDir });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`stdout: ${output}`);
      stdout += output;
    });

    pythonProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error(`stderr: ${errorOutput}`);
      stderr += errorOutput;
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        resolve(NextResponse.json({ success: true, message: 'Model run successfully.', stdout }));
      } else {
        resolve(NextResponse.json({ success: false, message: `Script failed with code ${code}.`, stderr }, { status: 500 }));
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
      resolve(NextResponse.json({ success: false, message: `Failed to start Python script: ${err.message}` }, { status: 500 }));
    });
  });
} 