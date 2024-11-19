# Single Window

Simple Javascript to enable a whatsapp-like single window experience for your users.

Call the intialization once per app at the bottom of your `<body>`:

```html
<script src="singlewindow.js"></script>
<script>
    //singleWindowApp('testApp', 'https://www.google.com');
    //singleWindowApp('testApp', true);
    //singleWindowApp('testApp', function() { alert('switched callback!'); });
    singleWindowApp('testApp', {
        homepage: 'https://www.google.com',
        allowSwitching: true,
        onSwitch: function () { alert('switched callback!'); }
    });
</script>
```

By default, the behavior is to try and close the window. However, due to browser restrictions this is not always possible. In that case, it will fall back to using the `homepage` setting.

## Current window
![current](https://github.com/user-attachments/assets/b5fe9bdb-60e9-4a99-8fc3-4022be9c8599)

## Locked window
![locked](https://github.com/user-attachments/assets/1b4f9d46-749d-4f22-8fe8-cca885e318d0)
