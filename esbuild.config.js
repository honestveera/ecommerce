const esbuild = require('esbuild');
const { svgPlugin } = require('esbuild-plugin-svg'); // Import the SVG loader

esbuild.build({
  entryPoints: ['app/javascript/application.js'],
  bundle: true,
  outfile: 'bundle.js',
  plugins: [svgPlugin()], // Add the SVG loader as a plugin
}).catch(() => process.exit(1));