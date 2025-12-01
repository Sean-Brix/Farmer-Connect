#!/usr/bin/env node

import { readdir, stat, readFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import readline from 'readline';

const execPromise = promisify(exec);

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlue: '\x1b[44m',
    bgGreen: '\x1b[42m',
};

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const TESTING_DIR = '.';

// Clear console
function clearConsole() {
    console.clear();
}

// Print header
function printHeader() {
    console.log(`${colors.bgBlue}${colors.bright}                                                    ${colors.reset}`);
    console.log(`${colors.bgBlue}${colors.bright}  🎭 PLAYWRIGHT TEST MANAGER - Farmer Connect  ${colors.reset}`);
    console.log(`${colors.bgBlue}${colors.bright}                                                    ${colors.reset}`);
    console.log();
}

// Get all test files
async function getTestFiles() {
    try {
        const files = await readdir(TESTING_DIR);
        const testFiles = [];

        for (const file of files) {
            const filePath = join(TESTING_DIR, file);
            const fileStat = await stat(filePath);
            
            if (fileStat.isFile() && file.endsWith('.spec.js')) {
                const content = await readFile(filePath, 'utf-8');
                const testCount = (content.match(/test\(/g) || []).length;
                
                testFiles.push({
                    name: file,
                    path: filePath,
                    size: fileStat.size,
                    modified: fileStat.mtime,
                    testCount: testCount
                });
            }
        }

        return testFiles.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.log(`${colors.red}Error reading test files: ${error.message}${colors.reset}`);
        return [];
    }
}

// Format file size
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Display test files
async function displayTestFiles() {
    const files = await getTestFiles();
    
    if (files.length === 0) {
        console.log(`${colors.yellow}No test files found in ${TESTING_DIR}${colors.reset}\n`);
        return [];
    }

    console.log(`${colors.cyan}${colors.bright}Available Test Files:${colors.reset}\n`);
    
    files.forEach((file, index) => {
        const testLabel = file.testCount === 1 ? 'test' : 'tests';
        console.log(`${colors.bright}[${index + 1}]${colors.reset} ${colors.green}${file.name}${colors.reset}`);
        console.log(`    ${colors.dim}Tests: ${file.testCount} ${testLabel} | Size: ${formatSize(file.size)} | Modified: ${formatDate(file.modified)}${colors.reset}`);
    });
    
    console.log();
    return files;
}

// Run specific test file
async function runTest(filePath, options = '') {
    console.log(`${colors.yellow}Running test: ${basename(filePath)}...${colors.reset}\n`);
    
    try {
        const { stdout, stderr } = await execPromise(`npx playwright test --config=config/playwright.config.js "${filePath}" ${options}`);
        console.log(stdout);
        if (stderr) console.error(`${colors.red}${stderr}${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}Test execution error:${colors.reset}`);
        console.log(error.stdout || error.message);
    }
}

// Run all tests
async function runAllTests(options = '') {
    console.log(`${colors.yellow}Running all tests...${colors.reset}\n`);
    
    try {
        const { stdout, stderr } = await execPromise(`npx playwright test --config=config/playwright.config.js ${options}`);
        console.log(stdout);
        if (stderr) console.error(`${colors.red}${stderr}${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}Test execution error:${colors.reset}`);
        console.log(error.stdout || error.message);
    }
}

// Open Playwright UI
async function openPlaywrightUI() {
    console.log(`${colors.yellow}Opening Playwright UI Mode...${colors.reset}\n`);
    console.log(`${colors.dim}Press Ctrl+C to exit UI mode and return to menu${colors.reset}\n`);
    
    try {
        const child = exec('npx playwright test --config=config/playwright.config.js --ui');
        
        child.stdout.on('data', (data) => process.stdout.write(data));
        child.stderr.on('data', (data) => process.stderr.write(data));
        
        await new Promise((resolve) => {
            child.on('close', resolve);
        });
    } catch (error) {
        console.error(`${colors.red}Error opening UI: ${error.message}${colors.reset}`);
    }
}

// Show test report
async function showReport() {
    console.log(`${colors.yellow}Opening test report...${colors.reset}\n`);
    
    try {
        const { stdout, stderr } = await execPromise('npx playwright show-report');
        console.log(stdout);
        if (stderr) console.error(`${colors.red}${stderr}${colors.reset}`);
    } catch (error) {
        console.error(`${colors.red}Error showing report: ${error.message}${colors.reset}`);
    }
}

// Generate test with Codegen
async function openCodegen() {
    console.log(`${colors.yellow}Opening Playwright Codegen...${colors.reset}\n`);
    console.log(`${colors.dim}This will open a browser to record your actions${colors.reset}`);
    console.log(`${colors.dim}Press Ctrl+C to stop recording${colors.reset}\n`);
    
    const url = await question(`${colors.cyan}Enter URL to test (or press Enter for localhost:8080): ${colors.reset}`);
    const targetUrl = url.trim() || 'http://localhost:8080';
    
    try {
        const child = exec(`npx playwright codegen ${targetUrl}`);
        
        child.stdout.on('data', (data) => process.stdout.write(data));
        child.stderr.on('data', (data) => process.stderr.write(data));
        
        await new Promise((resolve) => {
            child.on('close', resolve);
        });
    } catch (error) {
        console.error(`${colors.red}Error opening codegen: ${error.message}${colors.reset}`);
    }
}

// Main menu
async function mainMenu() {
    while (true) {
        clearConsole();
        printHeader();
        
        const files = await displayTestFiles();
        
        console.log(`${colors.cyan}${colors.bright}Options:${colors.reset}`);
        console.log(`${colors.bright}[A]${colors.reset} Run ${colors.green}ALL${colors.reset} tests`);
        console.log(`${colors.bright}[U]${colors.reset} Open Playwright ${colors.blue}UI Mode${colors.reset}`);
        console.log(`${colors.bright}[H]${colors.reset} Run tests in ${colors.yellow}Headed Mode${colors.reset} (visible browser)`);
        console.log(`${colors.bright}[D]${colors.reset} Run tests in ${colors.magenta}Debug Mode${colors.reset}`);
        console.log(`${colors.bright}[R]${colors.reset} Show test ${colors.cyan}Report${colors.reset}`);
        console.log(`${colors.bright}[C]${colors.reset} Open ${colors.green}Codegen${colors.reset} (record tests)`);
        console.log(`${colors.bright}[1-${files.length}]${colors.reset} Run specific test file`);
        console.log(`${colors.bright}[Q]${colors.reset} Quit\n`);
        
        const answer = await question(`${colors.bright}Select an option: ${colors.reset}`);
        const choice = answer.trim().toUpperCase();
        
        if (choice === 'Q') {
            console.log(`\n${colors.green}Goodbye!${colors.reset}\n`);
            rl.close();
            process.exit(0);
        } else if (choice === 'A') {
            clearConsole();
            printHeader();
            await runAllTests();
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else if (choice === 'U') {
            clearConsole();
            printHeader();
            await openPlaywrightUI();
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else if (choice === 'H') {
            clearConsole();
            printHeader();
            await runAllTests('--headed');
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else if (choice === 'D') {
            clearConsole();
            printHeader();
            await runAllTests('--debug');
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else if (choice === 'R') {
            clearConsole();
            printHeader();
            await showReport();
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else if (choice === 'C') {
            clearConsole();
            printHeader();
            await openCodegen();
            await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
        } else {
            const index = parseInt(choice) - 1;
            if (index >= 0 && index < files.length) {
                clearConsole();
                printHeader();
                
                console.log(`${colors.cyan}Run mode for ${files[index].name}:${colors.reset}`);
                console.log(`${colors.bright}[1]${colors.reset} Normal (headless)`);
                console.log(`${colors.bright}[2]${colors.reset} Headed (visible browser)`);
                console.log(`${colors.bright}[3]${colors.reset} Debug mode`);
                console.log(`${colors.bright}[4]${colors.reset} UI mode\n`);
                
                const mode = await question(`${colors.bright}Select mode (or Enter for normal): ${colors.reset}`);
                const modeChoice = mode.trim();
                
                clearConsole();
                printHeader();
                
                if (modeChoice === '2') {
                    await runTest(files[index].path, '--headed');
                } else if (modeChoice === '3') {
                    await runTest(files[index].path, '--debug');
                } else if (modeChoice === '4') {
                    await runTest(files[index].path, '--ui');
                } else {
                    await runTest(files[index].path);
                }
                
                await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
            } else {
                console.log(`${colors.red}Invalid option. Please try again.${colors.reset}`);
                await question(`\n${colors.dim}Press Enter to continue...${colors.reset}`);
            }
        }
    }
}

// Start the application
console.log(`${colors.green}${colors.bright}Starting Playwright Test Manager...${colors.reset}\n`);
mainMenu().catch((error) => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    rl.close();
    process.exit(1);
});
