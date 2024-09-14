import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';

const pkg = createRequire(import.meta.url)('./package.json');
const isDts = process.env.BUILD === 'dts';
const sourceFile = 'src/index.ts';

// ESM build configuration
const esmConfig = {
    input: sourceFile,
    output: [
        {
            file: pkg.exports['.'].import,
            format: 'es',
            sourcemap: false
        }
    ],
    plugins: [
        resolve(),
        typescript(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// UMD build configuration
const umdConfig = {
    input: sourceFile,
    output: {
        file: pkg.exports['.'].umd,
        format: 'umd',
        name: 'eventEmitter',
        sourcemap: false,
        plugins: !isDts ? [terser()] : []
    },
    plugins: [
        resolve(),
        typescript(),
        replace({
            preventAssignment: true,
            __version__: pkg.version
        })
    ]
};

// TypeScript type definition configuration
const dtsConfig = {
    input: sourceFile,
    output: {
        file: pkg.exports['.'].types,
        format: 'es'
    },
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: 'dist/dts' })
    ]
};

export default isDts ? dtsConfig : [esmConfig, umdConfig];
