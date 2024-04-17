
# react-native-siarashield


# Siarashield
To authenticate using siarashield


## Prerequisites

These steps are to dynamically get public and private keys.

## Installation

```sh
$ npm install react-native-dotenv
```

If you are using Yarn:

```sh
$ yarn add react-native-dotenv
```

**This Package Url** : Follow for more instruction [more instruction](https://www.npmjs.com/package/react-native-dotenv).

**Basic Setups** : 
Add this code in your babel.config file.

```json
{
  "plugins": [
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
      "safe": false,
      "allowUndefined": true,
    }]
  ]
}
```


Configuration : Create a file on your root folder which name is ".env" .

Note: Use public key "TEST-CYBERSIARA" for staging/development.

Note : Open this link you can generate your public and private key [open link](https://mycybersiara.com/).

**.env**

```dosini

PUBLIC_KEY = TEST-CYBERSIARA      <!-- In that place you can put your public and private key   -->
PRIVATE_KEY = TEST-CYBERSIARA
```

**Configuration This .env File into your project** :
Create a Folder on Your Project (src/Config) and after then Create a file which name is "envs.js"

```js

// Paste this code into your "envs.js" file
import {PUBLIC_KEY, PRIVATE_KEY} from "@env"

const PUBLIC_KEYS = {
    PUBLIC_KEY
}

const PRIVATE_KEYS = {
    PRIVATE_KEY
}

export default {PUBLIC_KEYS, PRIVATE_KEYS}

```



**Note** : First complete above steps after then follow below steps.


## Installation

Using npm:

```shell
npm install --save react-native-siarashield
```

or using yarn:

```shell
yarn add react-native-siarashield
```

##### Permissions

To get the Device Ip,

1) On Android you must get Device Ip permission:

```java
  <uses-permission android:name="android.permission.READ_PHONE_STATE" />
```


## Methods

```js

 // You can change isLogin Props value using this Callback Method.
  const loginVisible = (data) => {
    setIsLogin(data);   // Ex. setRegister(data)
  };

```


## Usage

```js
import CyberSiaraCaptcha from 'react-native-siarashield';

// Import this file for geting data from that file
import envs from '../Config/envs';

// create your useState.
// You can change the name of state. 
const [isLogin, setIsLogin] = useState(false);  // Ex. [isRegister , setRegister] etc.

// You can change props value by state variable.
  <CyberSiaraCaptcha
    isLogin={isLogin}      // Ex. isLogin = {isRegister}
    PUBLIC_KEY = {envs.PUBLIC_KEYS.PUBLIC_KEY}
    PRIVATE_KEY = {envs.PRIVATE_KEYS.PRIVATE_KEY}
    loginVisible={data => loginVisible(data)}
  />

```

