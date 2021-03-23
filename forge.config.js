const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'PlainWar',
    icon: path.resolve(__dirname, './src/assets/app'),
    asar: true,
    overwrite: true
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        title: 'PlainWar',
        exe: 'PlainWar.exe',
        iconUrl: path.resolve(__dirname, './src/assets/shortDomain.png'),
        setupIcon: path.resolve(__dirname, './src/assets/app.ico'),
        loadingGif: path.resolve(__dirname, './src/assets/setupLoading.gif')
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin'
      ]
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.tsx',
              name: 'main_window'
            }
          ]
        }
      }
    ]
  ]
}