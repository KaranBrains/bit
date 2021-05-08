// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,

  // BACKEND_WS_URL_CXR: 'ws://localhost:8891',
  // MENU: 'http://localhost:8888/frontend/crypto/menu',
  // CONVERSION_DROPDOWN: 'http://localhost:8888/frontend/crypto/markets/',
  // HISTORICAL_DATA: 'http://apiv2.bitcoinaverage.com/crypto/chart/',
  // CURRENCY_TAB: 'http://localhost:8888/frontend/crypto/info/',

  BACKEND_WS_URL_CXR: 'ws://apiv2-staging.bitcoinaverage.com',
  MENU: 'https://apiv2-staging.bitcoinaverage.com/frontend/crypto/menu',
  CONVERSION_DROPDOWN: 'https://apiv2-staging.bitcoinaverage.com/frontend/crypto/markets/',
  HISTORICAL_DATA: 'https://apiv2-staging.bitcoinaverage.com/crypto/chart/',
  CURRENCY_TAB: 'https://apiv2-staging.bitcoinaverage.com/frontend/crypto/info/'

};



/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
