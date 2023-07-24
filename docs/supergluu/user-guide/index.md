---
tags:
- Super Gluu
- User Guide
---

# Super Gluu User Guide

This guide will show how to use the Super Gluu two-factor authentication mobile application. It covers the initial setup,
managing keys and logs, and general settings.

!!! Note
The screenshots below are shown in iOS. Android is roughly the same.

## Initial Setup

### Camera Access Prompt
After installation, Super Gluu will request access to use your camera, which is used to scan a QR code to set up your
two-factor authentication.

### Choose Login Method

For additional security, Super Gluu gives you the option to configure either a passcode or TouchID to access Super Gluu.
This choice can be changed in the application settings later.

!!! Note
After 5 unsuccessful attempts to enter the passcode, the app is locked for 10 minutes.

Screen for the passcode and TouchID selection

![login choice](../../assets/supergluu/user-guide/choose_login.jpg)

Screen for enabling passcode

![pin access](../../assets/supergluu/user-guide/pin_settings.jpg)

Screen for enabling TouchID

![touch access](../../assets/supergluu/user-guide/touch_id_settings.jpg)

### Confirm Push Notification

Next, it will ask for permission to send push notifications from the Flex. This choice can be changed later in the
device settings. More information about the push notification will be covered later in the document.

![confirm Push Notification](../../assets/supergluu/user-guide/push_notifications.jpg)

## Main Screen

After configuration, the main screen is displayed. It features the main enrollment button in the center and the menu
button in the top right.

![home screen](../../assets/supergluu/user-guide/main_page.jpg)

### QR Code Enrollment

To enroll a device, enter the credentials in your Flex web app to generate a QR code, then click the `Scan QR Code`
button on the Super Gluu app's Home screen:

![scanning screen](../../assets/supergluu/user-guide/qr_code.jpg)

After it scans the code and the server returns the request correctly, it will prompt to `Approve` or `Deny`. To continue
the enrollment/authentication process, click `Approve`:

![scanning screen](../../assets/supergluu/user-guide/approve_prompt.jpg)

The timer on the top right of the screen shows the time limit to choose to `Approve` or `Deny`. As time runs out, the
number's color will change: yellow if it's under 20 seconds, red if it's under 10.

Next, it will redirect to the main page and display a success message.

![success message](../../assets/supergluu/user-guide/success.jpg)

## Menu

After pressing the menu button, you'll get the option to view logs, keys, settings, and help files. You can also check
the current app version in the bottom right corner. Tapping it for several seconds will show the details of the latest
commit.

![menu](../../assets/supergluu/user-guide/settings.jpg)

### Logs

Each time it enrolls or authenticates a device, the app will save corresponding logs in the Logs tab. The log details
whether authentication was successful, with more details available if the log is tapped on.

Clear these logs if desired by swiping left on the log, then tapping the red button.

![delete log](../../assets/supergluu/user-guide/log_delete.jpg)

The Log tab will report the enrollment and authentication process and display who logged in, when, and from
where. Just tap on the log to get to the information screen.

The information screen contains data about:

- Flex name & server URL
- Username
- IP address & location
- Time & date

![success message](../../assets/supergluu/user-guide/log_sample.jpg)

### Keys

This tab contains all available keys for each Flex. A key is a unique file that is generated during enrollment and is
used to authenticate the device on the server. If a key for a server is deleted, enroll again with a new key.

!!! Note
If you delete a key from your app but wish to re-enroll the same device against the same server, the corresponding
entry for that device also needs to be removed from the user record in the Flex.

![keys screen](../../assets/supergluu/user-guide/key.jpg)

To change a key's name, swipe left on it and tap the green button. To delete a key, swipe left on the key, then tap the
red button.

![delete key](../../assets/supergluu/user-guide/key_delete.jpg)

### Settings

In the Settings tab, there are options to configure the passcode or TouchID.

## Push Notifications

Super Gluu can receive push notifications from Flex. The server can send an enrollment or authentication request to the
application, as if it scanned the QR code directly.

![push notification](../../assets/supergluu/user-guide/push_notification.jpg)

After choosing to receive push notifications either during initial setup or through the Settings tab later, enroll
through the server. Super Gluu will send a token to the server, which will be used to send push notifications to the
device.

After receiving the notification, tap `Approve` or `Deny` directly from the push menu.

Super Gluu can receive a notification when the application is running in the foreground. It will look just like the
original authentication screen.

![push notification when app is running](../../assets/supergluu/user-guide/approve_prompt.jpg)

## Device Settings, iPad Support

There are a few options for Super Gluu in the device settings - push notifications, location, access to the camera, and
passcode protection. Any change made in the device settings will take effect in the application.

Super Gluu can run on iPads, and the layout is the same for all IOS devices.

For more information, please see the [Gluu Website](http://gluu.org)