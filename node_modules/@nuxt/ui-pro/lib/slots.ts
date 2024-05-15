// @ts-ignore
export const getSlotChildrenText = children => children.map(node => {
  if (!node.children || typeof node.children === 'string') return node.children || ''
  else if (Array.isArray(node.children)) return getSlotChildrenText(node.children)
  else if (node.children.default) return getSlotChildrenText(node.children.default())
}).join('')
