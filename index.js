// @flow

'use strict';

// $FlowFixMe
const ReactNative = require('react-native');
const NativeEventEmitter = ReactNative.NativeEventEmitter;
const RNDevMenu = ReactNative.NativeModules.RNDevMenu;

type RNDevMenuModule = {
  _eventHandlers?: Map<string, () => any>,
  _eventEmitter?: NativeEventEmitter,
  addItem: (name: string, handler: () => any) => Promise<void>
};

let DevMenu: RNDevMenuModule = {
  addItem(name, handler) {
    // $FlowFixMe
    if (global.__DEBUG__) {
      if (!this._eventHandlers) {
        this._eventHandlers = new Map();
      }

      this._eventHandlers.set(name, handler);

      if (!this._eventEmitter) {
        this._eventEmitter = new NativeEventEmitter(RNDevMenu);

        this._eventEmitter.addListener('customDevOptionTap', (name: string) => {
          if (this._eventHandlers) {
            const handler = this._eventHandlers.get(name);

            if (handler) {
              handler();
            }
          }
        });
      }

      return RNDevMenu.addItem(name);
    } else {
      return Promise.resolve();
    }
  }
};

module.exports = DevMenu;
