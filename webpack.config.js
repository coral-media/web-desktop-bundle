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
        from: './assets',
            // to: 'desktop/[path][name].[hash:8].[ext]'
        to: '[path][name].[ext]'
    })
module.exports = Encore.getWebpackConfig();
