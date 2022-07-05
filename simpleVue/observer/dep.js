/**
 * 收集依赖
 * 设置一个数组，所有的依赖放置到数组中，
 * 具有addSub,removeSub以及notify通知依赖更新方法
*/
let uid = 0;
export default class Dep {
    subs = [];
    id = 0;
    constructor () {
      this.id = uid++;
      this.subs = [];
    }

    addSub (sub) {
      this.subs.push(sub);
    }

    removeSub (sub) {
      const index = this.subs.indexOf(sub);
      if (index > -1) {
        this.subs.splice(index, 1)
      }
    }

    depend () {
      if (Dep.target) {
        Dep.target.addDep(this)
      }
    }

    notify () {
      const subs = this.subs.slice();// 创建一个新数组，避免影响原始数据
      for (let i = 0, l = subs.length; i < l; i++) {
        // 通知更新
        console.log('通知更新！');
        subs[i].update();// 调用更新方法
      }
    }
}
Dep.target = null;
const targetStack = [];
export function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}
export function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
