#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing React components...\n');

const components = [];
const stats = { total: 0, client: 0, server: 0, withState: 0, withEffects: 0 };

function scanComponents(dir) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      scanComponents(fullPath);
    } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
      analyzeComponent(fullPath);
    }
  });
}

function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const name = path.basename(filePath, '.tsx');

  const component = {
    name,
    path: path.relative(process.cwd(), filePath),
    isClient: content.includes('"use client"'),
    hasState: content.includes('useState'),
    hasEffects: content.includes('useEffect'),
    hooks: (content.match(/use\w+/g) || []).length,
    lines: content.split('\n').length
  };

  components.push(component);
  stats.total++;
  if (component.isClient) stats.client++;
  else stats.server++;
  if (component.hasState) stats.withState++;
  if (component.hasEffects) stats.withEffects++;

  console.log(`✅ Analyzed: ${name}`);
}

scanComponents('./src');

const report = `# Component Analysis Report

Generated: ${new Date().toLocaleDateString()}

## 📊 Quick Stats
- **Total Components**: ${stats.total}
- **Client Components**: ${stats.client}
- **Server Components**: ${stats.server}
- **With State**: ${stats.withState}
- **With Effects**: ${stats.withEffects}

## 📋 Component List

| Component | Type | Hooks | Lines | Features |
|-----------|------|-------|-------|----------|
${components.map(comp => {
  const features = [];
  if (comp.hasState) features.push('State');
  if (comp.hasEffects) features.push('Effects');
  return `| ${comp.name} | ${comp.isClient ? 'Client' : 'Server'} | ${comp.hooks} | ${comp.lines} | ${features.join(', ') || 'Basic'} |`;
}).join('\n')}

## 🎯 Component Details

${components.map(comp => `### ${comp.name}
- **Path**: \`${comp.path}\`
- **Type**: ${comp.isClient ? 'Client' : 'Server'} Component
- **Hooks Used**: ${comp.hooks}
- **Lines of Code**: ${comp.lines}
`).join('\n')}

---
*Analysis completed at ${new Date().toLocaleString()}*
`;

const docsDir = './docs';
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(path.join(docsDir, 'COMPONENT_ANALYSIS.md'), report);
console.log('\n✅ Component analysis saved to docs/COMPONENT_ANALYSIS.md');
