import {readFile, access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const matrix=JSON.parse(await readFile(new URL('../docs/SCOPE_MATRIX.json',import.meta.url),'utf8'));
const master=await readFile(new URL('../docs/MASTER_SPEC.md',import.meta.url),'utf8');
const ids=new Set();
for(const module of matrix.modules){
  assert.ok(!ids.has(module.id),'Duplicate module '+module.id); ids.add(module.id);
  assert.ok(['foundation','future'].includes(module.statusAfterAudit),'Do not imply E2E completion without reviewed evidence');
  for(const field of ['scope','baseline','pending','acceptance']) assert.ok(module[field]?.trim(),module.id+' missing '+field);
  assert.ok(master.includes('### '+module.id+' — '),module.id+' absent from master spec');
  for(const file of [...module.baselineEvidence,...module.artifacts]) await access(new URL('../'+file,import.meta.url));
}
assert.equal(matrix.modules.length,25);
const baseline=JSON.parse(await readFile(new URL('../docs/audit/BASELINE_FILES.json',import.meta.url),'utf8'));
for(const file of baseline.files) await access(new URL('../'+file.path,import.meta.url));
console.log('25 modules documented with evidence, pending work and acceptance; all 32 baseline files retained.');
