import process from 'node:process';
import os from 'node:os';
import fs from 'node:fs';
import { execa, execaSync } from './index3.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import childProcess from 'node:child_process';
import 'node:buffer';
import '../shared/nuxi.2155838d.mjs';
import 'child_process';
import 'path';
import 'fs';
import 'node:timers/promises';
import 'stream';

let isDockerCached;

function hasDockerEnv() {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch {
		return false;
	}
}

function isDocker() {
	// TODO: Use `??=` when targeting Node.js 16.
	if (isDockerCached === undefined) {
		isDockerCached = hasDockerEnv() || hasDockerCGroup();
	}

	return isDockerCached;
}

let cachedResult;

// Podman detection
const hasContainerEnv = () => {
	try {
		fs.statSync('/run/.containerenv');
		return true;
	} catch {
		return false;
	}
};

function isInsideContainer() {
	// TODO: Use `??=` when targeting Node.js 16.
	if (cachedResult === undefined) {
		cachedResult = hasContainerEnv() || isDocker();
	}

	return cachedResult;
}

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().toLowerCase().includes('microsoft')) {
		if (isInsideContainer()) {
			return false;
		}

		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft')
			? !isInsideContainer() : false;
	} catch {
		return false;
	}
};

const isWSL = process.env.__IS_WSL_TEST__ ? isWsl : isWsl();

const handler = error => {
	if (error.code === 'ENOENT') {
		throw new Error('Couldn\'t find the termux-api scripts. You can install them with: apt install termux-api');
	}

	throw error;
};

const clipboard$4 = {
	async copy(options) {
		try {
			await execa('termux-clipboard-set', options);
		} catch (error) {
			handler(error);
		}
	},
	async paste(options) {
		try {
			const {stdout} = await execa('termux-clipboard-get', options);
			return stdout;
		} catch (error) {
			handler(error);
		}
	},
	copySync(options) {
		try {
			execaSync('termux-clipboard-set', options);
		} catch (error) {
			handler(error);
		}
	},
	pasteSync(options) {
		try {
			return execaSync('termux-clipboard-get', options).stdout;
		} catch (error) {
			handler(error);
		}
	},
};

const termux = clipboard$4;

const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));

const xsel = 'xsel';
const xselFallback = path.join(__dirname$1, '../fallbacks/linux/xsel');

const copyArguments = ['--clipboard', '--input'];
const pasteArguments = ['--clipboard', '--output'];

const makeError = (xselError, fallbackError) => {
	let error;
	if (xselError.code === 'ENOENT') {
		error = new Error('Couldn\'t find the `xsel` binary and fallback didn\'t work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel');
	} else {
		error = new Error('Both xsel and fallback failed');
		error.xselError = xselError;
	}

	error.fallbackError = fallbackError;
	return error;
};

const xselWithFallback = async (argumentList, options) => {
	try {
		const {stdout} = await execa(xsel, argumentList, options);
		return stdout;
	} catch (xselError) {
		try {
			const {stdout} = await execa(xselFallback, argumentList, options);
			return stdout;
		} catch (fallbackError) {
			throw makeError(xselError, fallbackError);
		}
	}
};

const xselWithFallbackSync = (argumentList, options) => {
	try {
		return execaSync(xsel, argumentList, options).stdout;
	} catch (xselError) {
		try {
			return execaSync(xselFallback, argumentList, options).stdout;
		} catch (fallbackError) {
			throw makeError(xselError, fallbackError);
		}
	}
};

const clipboard$3 = {
	async copy(options) {
		await xselWithFallback(copyArguments, options);
	},
	copySync(options) {
		xselWithFallbackSync(copyArguments, options);
	},
	paste: options => xselWithFallback(pasteArguments, options),
	pasteSync: options => xselWithFallbackSync(pasteArguments, options),
};

const linux = clipboard$3;

const env = {
	LC_CTYPE: 'UTF-8', // eslint-disable-line unicorn/text-encoding-identifier-case
};

const clipboard$2 = {
	copy: async options => execa('pbcopy', {...options, env}),
	async paste(options) {
		const {stdout} = await execa('pbpaste', {...options, env});
		return stdout;
	},
	copySync: options => execaSync('pbcopy', {...options, env}),
	pasteSync: options => execaSync('pbpaste', {...options, env}).stdout,
};

const macos = clipboard$2;

promisify(childProcess.execFile);

function systemArchitectureSync() {
	const {arch, platform, env} = process;

	// Detect Node.js x64 binary running under Rosetta 2 on a ARM64 Mac.
	if (platform === 'darwin' && arch === 'x64') {
		const stdout = childProcess.execFileSync('sysctl', ['-inq', 'sysctl.proc_translated'], {encoding: 'utf8'});
		return stdout.trim() === '1' ? 'arm64' : 'x64';
	}

	if (arch === 'arm64' || arch === 'x64') {
		return arch;
	}

	if (platform === 'win32' && Object.hasOwn(env, 'PROCESSOR_ARCHITEW6432')) {
		return 'x64';
	}

	if (platform === 'linux') {
		const stdout = childProcess.execFileSync('getconf', ['LONG_BIT'], {encoding: 'utf8'});
		if (stdout.trim() === '64') {
			return 'x64';
		}
	}

	return arch;
}

const archtectures64bit = new Set([
	'arm64',
	'x64',
	'ppc64',
	'riscv64',
]);

function is64bitSync() {
	return archtectures64bit.has(systemArchitectureSync());
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const binarySuffix = is64bitSync() ? 'x86_64' : 'i686';

// Binaries from: https://github.com/sindresorhus/win-clipboard
const windowBinaryPath = path.join(__dirname, `../fallbacks/windows/clipboard_${binarySuffix}.exe`);

const clipboard$1 = {
	copy: async options => execa(windowBinaryPath, ['--copy'], options),
	async paste(options) {
		const {stdout} = await execa(windowBinaryPath, ['--paste'], options);
		return stdout;
	},
	copySync: options => execaSync(windowBinaryPath, ['--copy'], options),
	pasteSync: options => execaSync(windowBinaryPath, ['--paste'], options).stdout,
};

const windows = clipboard$1;

const platformLib = (() => {
	switch (process.platform) {
		case 'darwin': {
			return macos;
		}

		case 'win32': {
			return windows;
		}

		case 'android': {
			if (process.env.PREFIX !== '/data/data/com.termux/files/usr') {
				throw new Error('You need to install Termux for this module to work on Android: https://termux.com');
			}

			return termux;
		}

		default: {
			// `process.platform === 'linux'` for WSL.
			if (isWSL) {
				return windows;
			}

			return linux;
		}
	}
})();

const clipboard = {};

clipboard.write = async text => {
	if (typeof text !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof text}`);
	}

	await platformLib.copy({input: text});
};

clipboard.read = async () => platformLib.paste({stripFinalNewline: false});

clipboard.writeSync = text => {
	if (typeof text !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof text}`);
	}

	platformLib.copySync({input: text});
};

clipboard.readSync = () => platformLib.pasteSync({stripFinalNewline: false});

const clipboardy = clipboard;

export { clipboardy as default };
