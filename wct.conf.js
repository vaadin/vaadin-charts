var argv = require('yargs').argv;

module.exports = {
  registerHooks: function(context) {
    var saucelabsPlatforms = [
      'macOS 10.12/ipad@11.0',
      'macOS 10.12/iphone@10.3',
      'macOS 10.12/safari@11.0',
      'Windows 10/firefox@58',
      'Windows 10/microsoftedge@16',
      {
        'browserName': 'internet explorer',
        'platform': 'Windows 10',
        'version': '11',
        'screenResolution': '1600x1200'
      }
    ];

    var cronPlatforms = [
      'Android/chrome',
      'Windows 10/chrome@64',
      'Windows 10/firefox@58'
    ];

    var quickPlatforms = [
      'Windows 10/chrome@64'
    ];

    if (argv.env === 'saucelabs') {
      context.options.plugins.sauce.browsers = saucelabsPlatforms;
    } else if (argv.env === 'saucelabs-cron') {
      context.options.plugins.sauce.browsers = cronPlatforms;
    } else {
      context.options.plugins.sauce.browsers = quickPlatforms;
    }
  }
};
