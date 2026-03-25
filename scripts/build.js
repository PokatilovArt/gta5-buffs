import esbuild from 'esbuild';
import { altvEsbuild } from 'altv-esbuild';

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const serverOnly = args.includes('--server');
const clientOnly = args.includes('--client');

const buildServer = !clientOnly;
const buildClient = !serverOnly;

const altvExternals = [
    '@altv/server',
    '@altv/client',
    '@altv/shared',
    '@altv/natives',
];

/** @type {import('esbuild').BuildOptions} */
const serverConfig = {
    entryPoints: ['src/backend/main.ts'],
    outfile: 'dist/server/index.js',
    bundle: true,
    target: 'esnext',
    format: 'esm',
    platform: 'node',
    external: altvExternals,
    plugins: [
        altvEsbuild({
            mode: 'server',
            dev: {
                enabled: watchMode,
                enhancedRestartCommand: true,
            },
        }),
    ],
};

/** @type {import('esbuild').BuildOptions} */
const clientConfig = {
    entryPoints: ['src/client/main.ts'],
    outfile: 'dist/client/index.js',
    bundle: true,
    target: 'esnext',
    format: 'esm',
    external: altvExternals,
    plugins: [
        altvEsbuild({
            mode: 'client',
            dev: {
                enabled: watchMode,
                enhancedRestartCommand: true,
            },
        }),
    ],
};

async function build() {
    try {
        if (watchMode) {
            const contexts = [];

            if (buildServer) {
                const serverCtx = await esbuild.context(serverConfig);
                await serverCtx.watch();
                contexts.push(serverCtx);
                console.log('[build] Watching server...');
            }

            if (buildClient) {
                const clientCtx = await esbuild.context(clientConfig);
                await clientCtx.watch();
                contexts.push(clientCtx);
                console.log('[build] Watching client...');
            }
        } else {
            if (buildServer) {
                await esbuild.build(serverConfig);
                console.log('[build] Server built successfully');
            }

            if (buildClient) {
                await esbuild.build(clientConfig);
                console.log('[build] Client built successfully');
            }
        }
    } catch (error) {
        console.error('[build] Build failed:', error);
        process.exit(1);
    }
}

build();
