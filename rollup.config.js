import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { createRequire } from 'module';
const pkg = createRequire(import.meta.url)('./package.json');

const isDts = process.env.BUILD === 'dts';

// ESM build configuration
const esmConfig = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
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

// TypeScript type definition configuration
const dtsConfig = {
    input: 'dist/dts/index.d.ts',
    output: {
        file: pkg.types,
        format: 'es'
    },
    plugins: [
        dts(),
        del({ hook: 'buildEnd', targets: 'dist/dts' })
    ]
};

export default isDts ? dtsConfig : esmConfig;
