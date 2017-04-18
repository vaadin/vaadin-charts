module.exports = {
    verbose: false,
    testTimeout: 6 * 60 * 1000,
    plugins: {
        sauce: {
            disabled: true,
            browsers: [
                {
                    browserName: 'iphone',
                    platform: 'OS X 10.10',
                    version: '9.2',
                    deviceName: 'iPhone 6 Plus',
                    deviceOrientation: 'portrait'
                },
                {
                    browserName: 'android',
                    platform: 'Linux',
                    version: '5.1',
                    deviceName: 'Android Emulator',
                    deviceType: 'phone',
                    deviceOrientation: 'portrait'
                },
                "Windows 10/microsoftedge",
                "Windows 10/internet explorer",
                "Windows 10/chrome",
                "Windows 10/firefox",
                "OS X 10.10/safari"
            ]
        }
    }
};
