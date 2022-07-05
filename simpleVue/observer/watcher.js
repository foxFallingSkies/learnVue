/**
 * 监听数据
 * 1：将watcher类赋值给全局Dep.target.将数据塞入到数组中
 * 2：读取数据，由于读取数据会触发getter，然后再getter中将Dep.target写入到依赖数组中
 * 3：移除塞入的target.重新赋值
 * 4：当改变数据的时候，会触发observer中的setter方法。setter方法中会通知所有dep进行upodate
 * 5：执行依赖中的update，执行回调函数
*/
import Dep, { pushTarget, popTarget } from './dep'
export default class Watcher {
  /**
     *
     * @param {*} vm 监听的数据
     * @param {*} expOrFn 表达式或者方法，作为getter方法,例如监听a.b.c
     * @param {*} cb 回调方法
     * @param {*} options 监听的options。常见的为deep
     */
  constructor (vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.newDeps = [];
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = this.parsePath(expOrFn);
    }
    this.value = this.get();
  }

  /**
     * 通过getter获取数据
     * @returns
     */
  get () {
    pushTarget(this);
    const value = this.getter.call(this.vm, this.vm);// 调用observer中的get方法，用来收集依赖
    popTarget();
    return value;
  }

  /**
     * 添加依赖
     * @param {*} dep
     */
  addDep (dep) {
    this.newDeps.push(dep);
    dep.addSub(this);
  }

  /**
     * 更新
     */
  update () {
    const value = this.get();
    const oldValue = this.value;
    this.cb.call(this.vm, value, oldValue);
  }

  parsePath (path) {
    const segments = path.split('.');
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }
      return obj;// 这样就相当于可以直接数据在observer上的getter方法
    }
  }
}
