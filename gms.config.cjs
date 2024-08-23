module.exports = {
  apps: [
    {
      env: {
        name: "gms",
        port: "3010",
        DB_HOST: "mndSQL80.everleap.com",
        DB_DATABASE: "GrimmIS34",
        DB_USER: "grimmSA2",
        DB_PASSWORD: "Pnk-Str0-B#ll!",
        DB_MODE: 1,
        JWT_SECRETKEY:
          "4a1bde1048e772f3dccc7e2d2cfbca7952e3d6e754fbdb3c15330793c023f97f",
        NUXT_UI_PRO_LICENSE: "DE96572D-DF69-4CE2-8359-220121662EBA",
        NITRO_PORT: 3010,
        NITRO_PRESET: "node_cluster",
      },
      script: "./.output/server/index.mjs",
    },
  ],
};
