/**
 * 将对象设置为可监控，通过object.defineProperty来实现，
 * 由于此方法只针对Object有效，因此在进行监听前，需要进行判断，如果是对象，则走同一套，同时针对子数据也进行监听
 * 如果是数组，则调用数组的监听
 */
import Dep from './dep'
export default class Observer {
    value = {};
    constructor (value) {
      this.value = value;
      if (Array.isArray(value)) {
        // 如果是数组，则需要将数据进行遍历监听
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }

    walk (obj) {
      const keys = Object.keys(obj);
      keys.forEach(itme => {
        this.defineReactive(obj, itme)
      })
    }

    defineReactive (obj, key) {
      const dep = new Dep();
      let val = obj[key];
      let childObj = this.observer(val);// 将子数据进行监听
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
          if (Dep.target) {
            dep.depend();
          }
          console.log('获取数据');
          // 同时在这里收集依赖
          return val;
        },
        set: (newValue) => {
          // 判断是否相同，如果不相同，则设置值
          if (newValue !== val) {
            val = newValue;
            console.log('设置数据');
            childObj = this.observer(newValue);// 由于数据变化了，所以需要将子数据一并监听
            // 在这里进行更新通知
            dep.notify();
          }
        }
      })
    }

    observer (value) {
      if (!Array.isArray(value) && this.isObject(value)) {
        return new Observer(value);
      }
    }

    observerArray (value) {
      value.forEach(item => {
        this.observer(item);
      })
    }

    // 判断是否是对象
    isObject (value) {
      return value !== null && typeof value === 'object';
    }
}
