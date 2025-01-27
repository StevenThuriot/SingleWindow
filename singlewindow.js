const singleWindowApp = (function () {
    return function (application, settings) {
        if (!application) {
            throw new Error('Application name is required');
        }

        if (typeof application !== 'string') {
            throw new Error('Application name must be a string');
        }

        if (!application.trim()) {
            throw new Error('Application name cannot be empty');
        }

        application = 'single-window-' + application;

        if (!settings) {
            settings = {};
            // settings.homepage = 'https://example.com';
            // settings.allowSwitching = true;
        } else if (typeof settings === 'string') {
            settings = {
                homepage: settings
            };
        } else if (typeof settings === 'boolean') {
            settings = {
                allowSwitching: settings
            };
        } else if (typeof settings === 'function') {
            settings = {
                onSwitch: settings
            };
        } else if (typeof settings !== 'object') {
            throw new Error('Unsupported settings value');
        }

        if (!settings.hasOwnProperty('allowSwitching')) {
            settings.allowSwitching = true;
        } else if (typeof settings.allowSwitching !== 'boolean') {
            throw new Error('Unsupported allowSwitching type');
        }

        if (!settings.hasOwnProperty('onSwitch')) {
            settings.onSwitch = function () { };
        } else if (typeof settings.onSwitch !== 'function') {
            throw new Error('Unsupported onSwitch type');
        }

        if (settings.hasOwnProperty('homepage') && typeof settings.homepage !== 'string') {
            throw new Error('Unsupported homepage type');
        }

        if (!settings.id) {
            settings.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        } else if (typeof settings.id !== 'string') {
            settings.id = '' + settings.id;
        }

        window.localStorage.setItem(application, settings.id);

        let windowTitle = document.title;
        window.addEventListener('storage', function (event) {
            if (event.key === application && event.newValue !== settings.id) {
                if (document.getElementById('single-window-overlay')) {
                    return;
                }

                const overlay = document.createElement('div');
                overlay.id = 'single-window-overlay';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
                overlay.style.border = '1px solid #3b4a54';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';

                const innerOverlay = document.createElement('div');
                innerOverlay.style.width = '500px';
                innerOverlay.style.backgroundColor = '#3b4a54';
                innerOverlay.style.padding = '2em';
                innerOverlay.style.borderRadius = '5px';

                overlay.appendChild(innerOverlay);

                const textWrapper = document.createElement('div');
                textWrapper.style.marginBottom = '2em';
                textWrapper.style.display = 'flex';
                innerOverlay.appendChild(textWrapper);

                const messageIcon = document.createElement('span');
                messageIcon.style.fontSize = '1.5em';
                messageIcon.style.marginRight = '1em';
                messageIcon.innerText = '⛔';

                textWrapper.appendChild(messageIcon);

                const message = document.createElement('span');
                message.style.color = 'white';

                message.innerHTML = 'This application is open in another window.';

                if (settings.allowSwitching) {
                    message.innerHTML += '<br>Click "Use here" if you want to continue here instead.';
                }

                textWrapper.appendChild(message);

                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.display = 'flex';
                buttonWrapper.style.justifyContent = 'end';

                innerOverlay.appendChild(buttonWrapper);

                const closeButton = document.createElement('button');
                closeButton.style.border = '1px solid #0079a8';
                closeButton.style.borderRadius = '50px';
                closeButton.style.margin = '0 .5em';
                closeButton.style.backgroundColor = 'transparent';
                closeButton.style.color = '#0079a8';
                closeButton.style.padding = '.5em';
                closeButton.style.cursor = 'pointer';
                closeButton.innerHTML = 'Close Window';

                closeButton.addEventListener('click', function () {
                    window.close();

                    if (!!settings.homepage) {
                        window.location.href = homepage;
                    }
                });

                buttonWrapper.appendChild(closeButton);

                if (settings.allowSwitching) {
                    const useHereButton = document.createElement('button');
                    useHereButton.style.border = '1px solid #0079a8';
                    useHereButton.style.borderRadius = '50px';
                    useHereButton.style.margin = '0 .5em';
                    useHereButton.style.backgroundColor = '#0079a8';
                    useHereButton.style.color = '#333';
                    useHereButton.style.padding = '.5em';
                    useHereButton.style.cursor = 'pointer';
                    useHereButton.innerHTML = 'Use here';

                    useHereButton.addEventListener('click', function () {
                        document.body.removeChild(overlay);
                        window.localStorage.setItem(application, settings.id);
                        document.title = windowTitle;

                        setTimeout(function () {
                            settings.onSwitch(settings.id);
                        }, 0);
                    });

                    buttonWrapper.appendChild(useHereButton);
                }

                document.body.appendChild(overlay);

                windowTitle = document.title;
                document.title = '⛔ ' + windowTitle;
            }
        });
    }
})();