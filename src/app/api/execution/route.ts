const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { once } = require('events'); 

async function execute_python(code: string, input: string) {
    const temp_python_file = path.join(__dirname, 'temp.py');
    const input_file = path.join(__dirname, 'input.txt');
    try {
        await fs.writeFile(temp_python_file, code, (err: any) => {if (err) {console.error(err);}});
        await fs.writeFile(input_file, input, (err: any) => {if (err) {console.error(err);}});
        const child = spawn('python3', [temp_python_file], { stdio: ['pipe', 'pipe', 'pipe'], });
        fs.createReadStream(input_file).pipe(child.stdin);
        let output = '';
        let errorOutput = '';
        child.stdout.on('data', (data: String) => { output += data.toString();} );
        child.stderr.on('data', (data: String) => { errorOutput += data.toString();} );
        await once(child, 'close');
        if (errorOutput) return errorOutput;
        return output;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function execute_c(code: string, input: string): Promise<string> {
    const temp_c_file = path.join(__dirname, 'temp.c');
    const input_file = path.join(__dirname, 'input.txt');
    const compiled_file = path.join(__dirname, 'main');

    try {
        console.log("Writing C code to file...");
        await fs.writeFile(temp_c_file, code, (err: any) => {if (err) {console.error(err);}});
        await fs.writeFile(input_file, input, (err: any) => {if (err) {console.error(err);}});
        console.log("Compiling C code...");

        const compileChild = spawn('gcc', [temp_c_file, '-o', compiled_file]);
        
        let compileErrorOutput = '';
        compileChild.stderr.on('data', (data: Buffer) => {compileErrorOutput += data.toString();});

        const exitCode = await new Promise<number>((resolve) => {
            compileChild.on('close', (code: any) => { resolve(code); });
        });

        if (exitCode !== 0) return `Compile Error Output: ${compileErrorOutput.trim()}`;
        
        // Compile Errors Are Well Handled, but fix actual code crash behavior

        const execChild = spawn(`${compiled_file}`, { stdio: ['pipe', 'pipe', 'pipe'] });
        fs.createReadStream(input_file).pipe(execChild.stdin);

        let output = '';
        let errorOutput = '';
        execChild.stdout.on('data', (data: Buffer) => { output += data.toString(); });
        execChild.stderr.on('data', (data: Buffer) => { errorOutput += data.toString(); });
        await once(execChild, 'close');

        if (errorOutput) return errorOutput; 
        return output || "No output from C/C++ program.";
        
    } catch (e) {
        console.error(e);
        return "Error executing C/C++ code";
    }
}


async function execute_java(code: string, input: string): Promise<string> {
    const temp_java_file = path.join(__dirname, 'Temp.java');
    const input_file = path.join(__dirname, 'input.txt');

    try {
        await fs.writeFile(temp_java_file, code, (err: any) => {if (err) {console.error(err);}});
        await fs.writeFile(input_file, input, (err: any) => {if (err) {console.error(err);}});
        const compileChild = spawn('javac', [temp_java_file]);
        await once(compileChild, 'close');
        const execChild = spawn('java', ['Temp'], { stdio: ['pipe', 'pipe', 'pipe'] });
        fs.createReadStream(input_file).pipe(execChild.stdin);
        let output = '';
        execChild.stdout.on('data', (data: Buffer) => { output += data.toString(); });
        await once(execChild, 'close');
        return output || "Error executing Java code"; 
    } catch {
        return "Error executing Java code"; 
    }
}

async function execute_js(code: string, input: string) {
    const temp_js_file = path.join(__dirname, 'temp.js');
    const input_file = path.join(__dirname, 'input.txt');

    try {
        await fs.writeFile(temp_js_file, code, (err: any) => {if (err) {console.error(err);}});
        await fs.writeFile(input_file, input, (err: any) => {if (err) {console.error(err);}});
        const child = spawn('node', [temp_js_file], { stdio: ['pipe', 'pipe', 'pipe'] });
        fs.createReadStream(input_file).pipe(child.stdin);
        let output = '';
        child.stdout.on('data', (data: Buffer) => { output += data.toString(); });
        await once(child, 'close');
        return output || "Error executing JavaScript code";
    } catch {
        return "Error executing JavaScript code";
    }
}

export async function POST(req: Request) {
    const { code, input, language } = await req.json();

    try {
        let result;
        switch (language) {
            case 'Python':
                result = await execute_python(code, input);
                break;
            case 'C':
                result = await execute_c(code, input);
                break;
            case 'C++':
                result = await execute_c(code, input);
                break;
            case 'Java':
                result = await execute_java(code, input);
                break;
            case 'JavaScript':
                result = await execute_js(code, input);
                break;
            default:
                return Response.json({ message: "Not a supported language", status: 400 });
        }
        
        return Response.json({ output: result, status: 200 });

    } catch {
            return Response.json({ message: "Error during code execution", status: 500 });
    }
}
