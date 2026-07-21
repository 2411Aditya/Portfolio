const fs = require('fs');
const path = require('path');

const directory = './src';
const exts = ['.jsx', '.js'];

function processPath(p) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
        fs.readdirSync(p).forEach(f => processPath(path.join(p, f)));
    } else if (exts.includes(path.extname(p))) {
        let content = fs.readFileSync(p, 'utf8');
        
        content = content.split('bg-[#0a0a0b]').join('bg-bg-dark');
        content = content.split('bg-[#0a0a0a]').join('bg-bg-dark');
        content = content.split('text-white').join('text-text-main');
        content = content.split('text-gray-400').join('text-text-muted');
        content = content.split('text-gray-500').join('text-text-muted');
        content = content.split('border-white/10').join('border-border-base');
        content = content.split('border-white/20').join('border-border-hover');
        content = content.split('border-white/5').join('border-border-base');
        content = content.split('hover:bg-white/[0.02]').join('hover:bg-text-main/5');
        content = content.split('hover:text-gray-300').join('hover:text-text-muted');
        content = content.split('bg-white').join('bg-text-main');
        // for custom cursor
        content = content.split('border-white/30').join('border-text-main/30');
        
        fs.writeFileSync(p, content);
    }
}

processPath(directory);
