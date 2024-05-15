#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { n as nitroPkg } from '../chunks/package.mjs';

const main = defineCommand({
  meta: {
    name: nitroPkg.name,
    description: "Nitro CLI",
    version: nitroPkg.version
  },
  subCommands: {
    dev: () => import('./dev.mjs').then((r) => r.default),
    build: () => import('./build.mjs').then((r) => r.default),
    prepare: () => import('./prepare.mjs').then((r) => r.default),
    task: () => import('./index2.mjs').then((r) => r.default)
  }
});
runMain(main);
