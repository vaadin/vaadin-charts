var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    const sauceBrowsers = {
      'saucelabs-quick': [
        'Windows 10/chrome@64'
      ],

      // Isolate IE11 as it fails when run alongside other browsers
      'saucelabs-ie': [
        {
          'browserName': 'internet explorer',
          'platform': 'Windows 10',
          'version': '11',
          'screenResolution': '1600x1200'
        }
      ],

      'saucelabs-others': [
        'macOS 10.12/ipad@11.0',
        'macOS 10.12/iphone@10.3',
        'macOS 10.12/safari@11.0',
        'Windows 10/firefox@58',
        'Windows 10/microsoftedge@16'
      ],

      'saucelabs-cron': [
        'Android/chrome',
        'Windows 10/chrome@64',
        'Windows 10/firefox@58'
      ]
    };

    context.options.plugins.sauce.browsers = sauceBrowsers[argv.env] || sauceBrowsers['saucelabs-quick'];
  },

  clientOptions: {
    mochaOptions: {
      bail: true,
      retries: 3,
      timeout: 10000
    }
  }
};
