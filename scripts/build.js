import esbuild from 'esbuild';
import { altvEsbuild } from 'altv-esbuild';
import { copyFileSync, mkdirSync, writeFileSync } from 'fs';

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const serverOnly = args.includes('--server');
const clientOnly = args.includes('--client');

const buildServer = !clientOnly;
const buildClient = !serverOnly;

// Remap v2 module specifiers (@altv/*) to v1 equivalents (alt-*),
// since we run js-module v1 where only the legacy names exist at runtime.
const v2ToV1 = {
    '@altv/shared': 'alt-shared',
    '@altv/server': 'alt-server',
    '@altv/client': 'alt-client',
    '@altv/natives': 'natives',
};

/** @type {import('esbuild').Plugin} */
const altvV2ResolverPlugin = {
    name: 'altv-v2-to-v1',
    setup(build) {
        for (const [v2, v1] of Object.entries(v2ToV1)) {
            build.onResolve({ filter: new RegExp(`^${v2.replace('/', '\\/')}$`) }, () => ({
                path: v1,
                external: true,
            }));
        }
    },
};

const serverExternals = ['alt-server', 'alt-shared', 'vchat'];
const clientExternals = ['alt-client', 'alt-shared', 'natives'];

const RESOURCE_DIR = 'resources/gta5-buffs';

/** @type {import('esbuild').BuildOptions} */
const serverConfig = {
    entryPoints: ['src/backend/main.ts'],
    outfile: `${RESOURCE_DIR}/server/index.js`,
    bundle: true,
    target: 'esnext',
    format: 'esm',
    platform: 'node',
    external: serverExternals,
    plugins: [
        altvV2ResolverPlugin,
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
    outfile: `${RESOURCE_DIR}/client/index.js`,
    bundle: true,
    target: 'esnext',
    format: 'esm',
    external: clientExternals,
    plugins: [
        altvV2ResolverPlugin,
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
        mkdirSync(RESOURCE_DIR, { recursive: true });
        copyFileSync('resource.toml', `${RESOURCE_DIR}/resource.toml`);

        // Server runs in Node, which needs resolvable packages for alt:V
        // runtime modules. Create minimal stubs so Node's ESM loader doesn't
        // fail before alt:V intercepts the imports.
        // Client runs in V8 where alt:V resolves modules directly — no stubs needed.
        for (const pkg of serverExternals) {
            const dir = `${RESOURCE_DIR}/server/node_modules/${pkg}`;
            mkdirSync(dir, { recursive: true });
            writeFileSync(`${dir}/package.json`, JSON.stringify({ name: pkg, type: 'module', main: 'index.js' }));
            writeFileSync(`${dir}/index.js`, '// resolved by alt:V runtime\n');
        }

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
