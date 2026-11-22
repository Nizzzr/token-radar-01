// Token launch radar — make.fun bounty token-radar-01 (1.3k USDC)
// Reads a sealed DefiLlama snapshot, prints ranked table: address | name | usdcLiquidityUSD | status
// Run: node main.ts path/to/snapshot.json
import * as fs from 'node:fs';
const [,, path] = process.argv;
if (!path) { console.log(JSON.stringify({error:'usage: node main.ts <snapshot.json>'})); process.exit(1); }
const snap = JSON.parse(fs.readFileSync(path, 'utf8'));
const rows: {addr:string;name:string;usdc:number;status:string}[] = [];
for (const [addr, meta] of Object.entries(snap)) {
  const usdc = meta.usdcLiquidityUSD ?? 0;
  const status = usdc > 1_000_000 ? 'live' : usdc > 100_000 ? 'warm' : 'cold';
  rows.push({addr, name:meta.name||'', usdc, status});
}
rows.sort((a,b)=>b.usdc-a.usdc);
const hdr = `${'address'.padEnd(44)} | ${'name'.padEnd(24)} | ${'usdcLiquidityUSD'.padStart(14)} | status`;
const div = '-'.repeat(hdr.length);
console.log(hdr); console.log(div);
for (const r of rows) {
  console.log(`${r.addr.padEnd(44)} | ${r.name.padEnd(24)} | ${(r.usdc).toLocaleString('en-US',{maximumFractionDigits:0})'.padStart(14)} | ${r.status}`);
}
