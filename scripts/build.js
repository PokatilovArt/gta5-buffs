import esbuild from 'esbuild';
import { altvEsbuild } from 'altv-esbuild';
import { copyFileSync, mkdirSync, writeFileSync } from 'fs';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { replace } from 'esbuild-plugin-replace';
import packageJson from '../package.json' with { type: 'json' };

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const serverOnly = args.includes('--server');
const clientOnly = args.includes('--client');

const buildServer = !clientOnly;
const buildClient = !serverOnly;

// Remap v2 module specifiers (@altv/*) to v1 equivalents (alt-*),
// since we run js-module v1 where only the legacy names exist at runtime.
const v2ToV1Server = {
  '@altv/shared': 'alt-shared',
  '@altv/server': 'alt-server',
};

const v2ToV1Client = {
  '@altv/shared': 'alt-shared',
  '@altv/client': 'alt-client',
};

// Remap @altv/natives → natives without marking external,
// so altv-esbuild can intercept it and inject its banner variable.
const nativesResolverPlugin = {
  name: 'altv-natives-remap',
  setup(build) {
    build.onResolve({ filter: /^@altv\/natives$/ }, () => ({
      path: 'natives',
      namespace: 'altv-natives',
    }));
    build.onLoad({ filter: /.*/, namespace: 'altv-natives' }, () => ({
      contents: 'module.exports = ___altvEsbuild_altvInject_native___;',
      loader: 'js',
    }));
  },
};

/** @param {Record<string, string>} mapping */
function createV2ResolverPlugin(mapping) {
  return {
    name: 'altv-v2-to-v1',
    setup(build) {
      for (const [v2, v1] of Object.entries(mapping)) {
        build.onResolve({ filter: new RegExp(`^${v2.replace('/', '\\/')}$`) }, () => ({
          path: v1,
          external: true,
        }));
      }
    },
  };
}

const serverExternals = ['alt-server', 'alt-shared', 'vchat'];
const clientExternals = ['alt-client', 'alt-shared'];

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
    createV2ResolverPlugin(v2ToV1Server),
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
  sourcemap: 'inline',
  keepNames: true,
  plugins: [
    esbuildPluginTsc(),
    altvEsbuild({
      mode: 'client',
      dev: {
        enabled: true,
        enhancedRestartCommand: false,
        topLevelExceptionHandling: true,
        moveExternalsOnTopIgnore: ['@altv/client', '@altv/shared', '@altv/natives'], // Uncomment this line if you are using js-module
      },
    }),
    replace({
      include: /\.ts$/,
      __WEBVIEW_URL__: 'http://localhost:5173/',
    }),
  ],
  external: [...Object.keys(packageJson.dependencies), 'alt-client', '@altv/natives'],
};

/* BUILD CONFIG FROM MANGO BOILERPLATE - TRY IF WILL HAVE TIME

const clientConfig = {
  entryPoints: ['src/client/main.ts'],
  outfile: `${RESOURCE_DIR}/client/index.js`,
  bundle: true,
  target: 'esnext',
  format: 'esm',
  sourcemap: 'inline',
  keepNames: true,
  plugins: [
    esbuildPluginTsc(),
    altvEsbuild({
      mode: 'client',
      dev: {
        enabled: true,
        enhancedRestartCommand: false,
        topLevelExceptionHandling: true,
        moveExternalsOnTopIgnore: ['@altv/client', '@altv/shared', '@altv/natives'], // Uncomment this line if you are using js-module
      },
    }),
    replace({
      include: /\.ts$/,
      __WEBVIEW_URL__: 'http://localhost:5173/',
    }),
  ],
  external: [...Object.keys(packageJson.dependencies), 'alt-client', '@altv/natives'],
};s
*/

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
      writeFileSync(
        `${dir}/package.json`,
        JSON.stringify({ name: pkg, type: 'module', main: 'index.js' }),
      );
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
