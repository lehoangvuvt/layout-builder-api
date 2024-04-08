class TreeNode<T> {
  private key: string
  private parentNode: TreeNode<T>
  private value: T
  private childs: TreeNode<T>[]

  constructor(key: string, value: T) {
    this.key = key
    this.value = value
    this.parentNode = null
    this.childs = []
  }

  setParentNode(node: TreeNode<T>) {
    this.parentNode = node
  }

  addChild(child: TreeNode<T>) {
    child.setParentNode(this)
    this.childs.push(child)
  }
}

export class Tree<T> {
  private root: TreeNode<T>

  constructor() {
    this.root = new TreeNode<T>('root', null)
  }
}
