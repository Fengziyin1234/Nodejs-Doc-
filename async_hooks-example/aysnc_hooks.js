const asyncHooks = require('async_hooks')

// will contain metadata for all tracked events
const types = ['Timeout']
const _tracked = {}
const asyncHook = asyncHooks.createHook({
  init: (asyncId, type, triggerAsyncId, resource) => {
    if (!types || types.includes(type)) {
      const meta = {
        asyncId,
        type,
        pAsyncId: triggerAsyncId,
        res: resource,
      }
      _tracked[asyncId] = meta
      printMeta('init', meta)
    }
  },
  before: (asyncId) => {
    const meta = _tracked[asyncId]
    if (meta) printMeta('before', meta)
  },
  after: (asyncId) => {
    const meta = _tracked[asyncId]
    if (meta) printMeta('after', meta)
  },
  destroy: (asyncId) => {
    const meta = _tracked[asyncId]
    if (meta) printMeta('destroy', meta)
    // delete meta for the event
    delete _tracked[asyncId]
  },
  promiseResolve: (asyncId) => {
    const meta = _tracked[asyncId]
    if (meta) printMeta('promiseResolve', meta)
  },
})
asyncHook.enable()
function printMeta(eventName, meta) {
  console.log(`[${eventName}] asyncId=${meta.asyncId}, ` +
    `type=${meta.type}, pAsyncId=${meta.pAsyncId}, ` +
    `res type=${meta.res.constructor.name}`)
}


setTimeout(() => {
  console.log('Timeout happened')
}, 0)
console.log('Registered timeout')
