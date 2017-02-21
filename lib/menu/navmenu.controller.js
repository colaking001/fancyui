/**
 * @description xxxx
 *
 * @author fuzhiyuan1@wandan.cn
 * @date Fri Feb 17 2017 20:05:15 GMT+0800 (CST)
 * @example: http://www.fancyui.org/#/zh-cn/component/navmenu
 */

import Tree from 'js-tree-structure';

class NavmenuController {
  constructor() {
    this.name = 'navmenu';


    this.href = this.config.hrefAttr;
    this.text = this.config.textAttr;
    this.icon = this.config.iconAttr;
    this.children = this.config.childrenAttr;
    this.id = this.config.idAttr;
    this.parent = this.config.parentAttr;

    this.matchCurrentUrl = this.config.matchCurrentUrl;

    if(!this.matchCurrentUrl || typeof this.matchCurrentUrl != 'function'){
      this.matchCurrentUrl = () => false;
    }

    let data = {
      id: '_auto_root_',
      [this.children]: this.menuData
    };
    this.tree = new Tree(data, this.config);

    this.checkActiveMenu();
  }

  checkActiveMenu() {
    this.tree.traverse(node => {
      if (!node) {
        return true;
      }
      //if (node.children) {
        node.hide = true;
      //}
      if ((!node[this.children] || !node[this.children].length) && this.matchCurrentUrl(node)) {
        node.active = true;

        this.tree.traverseUp(node, node => {
          if(!node){
            return true;
          }
          node.hide = false;
        });
      }
    })
  }

  clickHandler(e) {
    let nodeId = (e.target.attributes['data-id'].nodeValue);

    let node = this.tree.getNodeById(nodeId);

    if(!node) {
      alert("can't find node by id:" + nodeId);
    }

    if(this.onSelect && typeof this.onSelect == 'function') {
      this.onSelect(node);
    }

    if(node[this.children] && node[this.children].length) {
      node.hide = !node.hide;

      if(node.hide) {
        let tempTree = new Tree(node, this.config);
        tempTree.traverse(node => {
          if (node[this.children] && node[this.children].length) {
            node.hide = true;
          }

          node.active = false;
        })
      }
    } else {
      this.tree.traverse(node => {
        node.active = false;
      });
      node.active = true
    }
  }
}

export default NavmenuController;