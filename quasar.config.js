// Configuration สำหรับแอป Quasar ของเรา
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers' // นำเข้าฟังก์ชัน defineConfig จาก Quasar wrapper

export default defineConfig((/* ctx */) => {
  return {
    // preFetch feature สำหรับดึงข้อมูลล่วงหน้า
    // preFetch: true,

    // app boot file (/src/boot)
    // ไฟล์ boot จะถูกรันก่อน main.js
    boot: [],

    // กำหนด CSS ของโปรเจค
    css: ['app.scss'],

    // กำหนด font และ icon ชุดพิเศษ
    extras: [
      // 'ionicons-v4',
      // 'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // ใช้หรือไม่ก็ได้

      'roboto-font', // ฟอนต์หลัก
      'material-icons', // ชุดไอคอน Material
    ],

    // การตั้งค่า build ของโปรเจค
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'], // target browser
        node: 'node20', // target Node.js
      },

      vueRouterMode: 'hash', // ใช้ hash mode ของ Vue Router
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuild cache ของ Vite/linter

      // publicPath: '/',
      // analyze: true,
      // env: {},
      // rawDefine: {},
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      // extendViteConf (viteConf) {},
      // viteVuePluginOptions: {},

      vitePlugins: [
        [
          'vite-plugin-checker', // ตรวจสอบ ESLint
          {
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{js,mjs,cjs,vue}"', // คำสั่ง lint
              useFlatConfig: true,
            },
          },
          { server: false }, // ไม่เปิด server ของ plugin
        ],
      ],
    },

    // ตั้งค่า dev server
    devServer: {
      // https: true,
      open: true, // เปิด browser อัตโนมัติ
    },

    // ตั้งค่า Quasar Framework
    framework: {
      config: {},

      // iconSet: 'material-icons',
      // lang: 'en-US',

      // components: [],
      // directives: [],

      // เพิ่ม Quasar plugin
      plugins: ['Notify'], // ← เพิ่ม Notify plugin สำหรับแจ้งเตือน
    },

    // animations: 'all', // ใช้ animation ทั้งหมด
    animations: [],

    // SSR configuration
    ssr: {
      prodPort: 3000, // port สำหรับ production
      middlewares: ['render'], // middleware สำหรับ SSR
      pwa: false, // ไม่ใช้ PWA กับ SSR
    },

    // PWA configuration
    pwa: {
      workboxMode: 'GenerateSW', // ใช้ Generate Service Worker
      // swFilename: 'sw.js',
      // manifestFilename: 'manifest.json',
    },

    // Cordova configuration
    cordova: {
      // noIosLegacyBuildFlag: true,
    },

    // Capacitor configuration
    capacitor: {
      hideSplashscreen: true, // ซ่อน splashscreen
    },

    // Electron configuration
    electron: {
      preloadScripts: ['electron-preload'], // preload script
      inspectPort: 5858, // port debug
      bundler: 'packager', // bundler
      packager: {}, // config packager
      builder: {
        appId: 'final6704101359', // กำหนด appId
      },
    },

    // Browser Extension (BEX)
    bex: {
      extraScripts: [], // สคริปต์เพิ่มเติมสำหรับ BEX
    },
  }
})
