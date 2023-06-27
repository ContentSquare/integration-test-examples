import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import livereload from 'rollup-plugin-livereload';

const sveltePreprocess = require('svelte-preprocess');

const production = !process.env.ROLLUP_WATCH;

function serve(options = {}) {
    let server;
  
    function toExit() {
      if (server) server.kill(0);
    }
  
    return {
      writeBundle() {
        if (server) return;
  
        const args = ['run', production ? 'start' : 'start:dev', '--'];
        Object.entries(options).forEach(([k, v]) => v && args.push(`--${k}`, typeof v !== 'boolean' ? v : ''));
  
        server = require('child_process').spawn('npm', args, {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
  
        process.on('SIGTERM', toExit);
        process.on('exit', toExit);
      },
    };
}

export default {
    input: 'src/main.ts',
    output: {
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js',
        watch: true,
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({
                typescript: {
                    tsconfigFile: './tsconfig.json'
                }
            }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            }
        }),
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production
        }),
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production &&
        serve({
          port: 8080
        }),    

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false
    }
};
