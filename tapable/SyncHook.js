const defaultPluginOptions = {
  name: '',
  stage: 0,
};

class SyncHook {
  constructor() {
    this.plugins = [];
    this.context = {};
  }

  tap(pluginOptions, fn) {
    let plugin;
    if (typeof pluginOptions === 'string') {
      plugin = {
        ...defaultPluginOptions,
        name: pluginOptions,
        fn,
      };
    } else {
      plugin = {
        ...defaultPluginOptions,
        ...pluginOptions,
        fn,
      };
    }
    if (this.plugins.length === 0) {
      this.plugins.push(plugin);
    } else {
      for (let i = this.plugins.length - 1; i >= 0; i--) {
        const currentPlugin = this.plugins[i];
        if (plugin.stage <= currentPlugin.stage) {
          this.plugins.splice(i + 1, 0, plugin);
          return;
        }
      }
      this.plugins.unshift(plugin);
    }
  }
  call(...args) {
    this.plugins.forEach(plugin => {
      plugin.fn(...args, this.context);
    });
  }
}

export default SyncHook;
