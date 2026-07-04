import fs from 'fs';

// Read the TS files
const holidaysContent = fs.readFileSync('./constants/holidays.ts', 'utf-8');
const salariesContent = fs.readFileSync('./constants/salaryDates.ts', 'utf-8');

// Extract the arrays using a dirty regex/eval approach or just use Vite-node.
// Since it's a vite project, we can use npx vite-node
