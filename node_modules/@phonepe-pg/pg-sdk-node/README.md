# PhonePe B2B Payment Gateway SDK for Node

![npm](https://img.shields.io/badge/npm-1.0.0-blue)
![Node](https://img.shields.io/badge/Node-14.21+-orange)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

A Node package for seamless integration with PhonePe Payment Gateway APIs.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
  - [Node](#node)
- [Quick Start](#quick-start)
  - [Initialization](#initialization)
  - [Standard Checkout Flow](#standard-checkout-flow)
  - [Checking Order Status](#checking-order-status)
  - [Handling Callbacks](#handling-callbacks)
  - [SDK Order Integration](#sdk-order-integration)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node Version: 14.21

## Installation

### Node

Install the dependency using npm:

```bash
npm i @phonepe-pg/pg-sdk-node
```

## Quick Start

### Initialization

Before using the SDK, you need to acquire your credentials from the [PhonePe Merchant Portal](https://developer.phonepe.com/v1/docs/merchant-onboarding).

You need three key pieces of information:
1. `clientId` - Your merchant identifier
2. `clientSecret` - Your authentication secret
3. `clientVersion` - API version to use

```javascript
import {StandardCheckoutClient, Env} from '@phonepe-pg/pg-sdk-node';
 
const clientId = "<clientId>";
const clientSecret = "<clientSecret>";
const clientVersion = 1;        //insert your client version here
const env = Env.SANDBOX;        //change to Env.PRODUCTION when you go live
 
const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
```

### Standard Checkout Flow

To initiate a payment, create a request using `StandardCheckoutPayRequest.builder()`:

```javascript
import {StandardCheckoutPayRequest} from '@phonepe-pg/pg-sdk-node';
import {randomUUID} from 'crypto';
  
const merchantOrderId = randomUUID();
const amount = 100;
const redirectUrl = "https://www.merchant.com/redirect";
  
const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .build();
  
client.pay(request).then((response)=> {
    const checkoutPageUrl = response.redirectUrl;
    console.log(checkoutPageUrl);
})

// Redirect the user to checkoutPageUrl to complete the payment
```

### Checking Order Status

To check the status of an order:

```javascript
const merchantOrderId = '<MERCHANT_ORDER_ID>';        //Order Id used for creating new order
 
client.getOrderStatus(merchantOrderId).then((response) => {
  const state = response.state;
});

// Handle the state accordingly in your application
```

### Handling Callbacks

PhonePe sends callbacks to your configured endpoint. Validate these callbacks to ensure they're authentic:

```javascript
const authorizationHeaderData = "<FETCH_SHA_256_DATA_FROM_HEADER>" // received in the response headers
const phonepeS2SCallbackResponseBodyString = "{\"type\": \"PG_ORDER_COMPLETED\",\"payload\": {}}"  // receiver in response body
  
const usernameConfigured = "<MERCHANT_USERNAME>"
const passwordConfigured = "<MERCHANT_PASSWORD>" 
 
try {
    const callbackResponse = client.validateCallback(
        usernameConfigured,
        passwordConfigured,
        authorizationHeaderData,
        phonepeS2SCallbackResponseBodyString );
    
    const orderId = callbackResponse.payload.orderId;
    const state = callbackResponse.payload.state;

    // Process the order based on its state
} catch (err) {
    // Handle invalid callback - potential security issue
}

```

### SDK Order Integration

For mobile SDK integration, first create an order on your server:

```javascript
import {StandardCheckoutClient, Env, CreateSdkOrderRequest} from '@phonepe-pg/pg-sdk-node';
import {randomUUID} from 'crypto';
 
const clientId = "<clientId>";
const clientSecret = "<clientSecret>";
const clientVersion = 1;  //insert your client version here
const env = Env.SANDBOX;      //change to Env.PRODUCTION when you go live
 
const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);
 
const merchantOrderId = randomUUID();
const amount = 1000;
const redirectUrl = "https://redirectUrl.com";
 
const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .build();
 
client.createSdkOrder(request).then((response) => {
    const token = response.token
})

// Pass this token to your mobile app to initiate payment through the PhonePe SDK

#### Disabling Payment Retry

You can disable the payment retry option for a transaction by setting `disablePaymentRetry` to `true`. This is applicable for both `StandardCheckoutPayRequest` and `CreateSdkOrderRequest`.

For `StandardCheckoutPayRequest`:

```javascript
const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .disablePaymentRetry(true) // Set to true to disable payment retry
        .build();
```

For `CreateSdkOrderRequest`:

```javascript
const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
        .merchantOrderId(merchantOrderId)
        .amount(amount)
        .redirectUrl(redirectUrl)
        .disablePaymentRetry(true) // Set to true to disable payment retry
        .build();
```

## Documentation

For detailed API documentation, advanced features, and integration options:

- [Standard Checkout Documentation](https://developer.phonepe.com/v1/reference/nodejs-sdk-standard-checkout)
- [PhonePe Developer Portal](https://developer.phonepe.com/)

## Contributing

Contributions to PG Node SDK are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

```
Copyright 2025 PhonePe Private Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```