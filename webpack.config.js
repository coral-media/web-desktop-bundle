let Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('./src/Resources/public/')
    .setPublicPath('/')
    .setManifestKeyPrefix('bundles/coralmediawebdesktop')
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    .addEntry('app', './assets/app.js')
    .copyFiles({
        from: './node_modules/chart.js/dist',
        to: 'desktop/chart.js/[path][name].[ext]'
    })
    .copyFiles({
        from: './node_modules/@fortawesome/fontawesome-free/webfonts/',
        // relative to the output dir
        to: 'font-awesome/webfonts/[name].[ext]'
    })
    .copyFiles({
        from: './node_modules/@fortawesome/fontawesome-free/css/',
        // relative to the output dir
        to: 'font-awesome/css/[name].[ext]'
    })
    .copyFiles({
        from: './assets/desktop',
            // to: 'desktop/[path][name].[hash:8].[ext]'
        to: 'desktop/[path][name].[ext]'
    })
    .copyFiles({
        from: './assets/ext-3.4.1',
            // to: 'ext-3.4.1/[path][name].[hash:8].[ext]'
        to: 'ext-3.4.1/[path][name].[ext]'
    })
    .copyFiles({
        from: './assets/requirejs',
            // to: 'ext-3.4.1/[path][name].[hash:8].[ext]'
        to: 'requirejs/[path][name].[ext]'
    })
module.exports = Encore.getWebpackConfig();
