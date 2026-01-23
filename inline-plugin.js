// Helper function to escape special regex characters
function escapeRegexChars(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function inlineAssetsPlugin() {
  return {
    name: 'inline-assets',
    enforce: 'post',
    generateBundle(options, bundle) {
      const htmlFiles = Object.keys(bundle).filter(i => i.endsWith('.html'));
      const cssAssets = Object.keys(bundle).filter(i => i.endsWith('.css'));
      const jsAssets = Object.keys(bundle).filter(i => i.endsWith('.js'));

      htmlFiles.forEach((htmlFile) => {
        const htmlChunk = bundle[htmlFile];
        let html = htmlChunk.source;

        // Inline CSS
        cssAssets.forEach((cssFile) => {
          const cssChunk = bundle[cssFile];
          const cssContent = cssChunk.source;
          const cssFileName = escapeRegexChars(cssFile.split('/').pop());
          
          html = html.replace(
            new RegExp(`<link[^>]*?href=["'][^"']*${cssFileName}["'][^>]*?>`, 'g'),
            `<style>${cssContent}</style>`
          );
        });

        // Inline JS - replace all script tags for each JS file
        jsAssets.forEach((jsFile) => {
          const jsChunk = bundle[jsFile];
          let jsContent = jsChunk.code;
          
          // Remove __VITE_PRELOAD__ references since we're inlining everything
          jsContent = jsContent.replace(/__VITE_PRELOAD__/g, '(()=>({}))');
          
          const jsFileName = escapeRegexChars(jsFile.split('/').pop());
          
          const scriptRegex = new RegExp(`<script[^>]*?src="[^"]*${jsFileName}"[^>]*?></script>`, 'g');
          
          // Count how many times this script appears
          const matches = html.match(scriptRegex);
          if (matches) {
            let firstReplacement = true;
            html = html.replace(scriptRegex, () => {
              if (firstReplacement) {
                firstReplacement = false;
                // First occurrence: replace with inline script
                return `<script type="module">${jsContent}</script>`;
              } else {
                // Subsequent occurrences: remove them
                return '';
              }
            });
          }
        });

        htmlChunk.source = html;
        
        // Delete CSS and JS files after inlining
        cssAssets.forEach(file => delete bundle[file]);
        jsAssets.forEach(file => delete bundle[file]);
      });
    }
  };
}
