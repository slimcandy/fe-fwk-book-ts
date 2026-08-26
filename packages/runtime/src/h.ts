import type { Attributes } from './attributes'
import type { EventHandlers } from './events'
import { withoutNulls } from './utils/arrays'
import { assert } from './utils/assert'

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
} as const

export type ElementVNodeProps = Attributes & {
  on?: EventHandlers
}

export interface ElementVNode<
  K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> {
  type: typeof DOM_TYPES.ELEMENT
  tag: K
  props: ElementVNodeProps
  children: VNode[]
  el?: HTMLElementTagNameMap[K]
  listeners?: EventHandlers
}

export interface TextVNode {
  type: typeof DOM_TYPES.TEXT
  value: string
  el?: Text
}

export interface FragmentVNode {
  type: typeof DOM_TYPES.FRAGMENT
  children: VNode[]
  el?: HTMLElement
}

export type VNode = TextVNode | ElementVNode | FragmentVNode

type VNodeChild = VNode | string | null

/**
 * Hypertext function: creates a virtual node representing an element with
 * the passed in tag.
 *
 * The props are added to the element as attributes.
 * There are some special props:
 * - `on`: an object containing event listeners to add to the element
 * - `class`: a string or array of strings to add to the element's class list
 * - `style`: an object containing CSS properties to add to the element's style
 *
 * The children are added to the element as child nodes.
 * If a child is a string, it is converted to a text node using `hString()`.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElementVNodeProps = {},
  children: VNodeChild[] = []
): ElementVNode<K> {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  }
}

/**
 * Creates a text virtual node.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 */
export function hString(str: string): TextVNode {
  return { type: DOM_TYPES.TEXT, value: str }
}

/**
 * Wraps the virtual nodes in a fragment.
 *
 * If a child is a string, it is converted to a text node using `hString()`.
 */
export function hFragment(vNodes: VNodeChild[]): FragmentVNode {
  assert(Array.isArray(vNodes), 'hFragment expects an array of vNodes')

  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  }
}

function mapTextNodes(children: (VNode | string)[]): VNode[] {
  return children.map((child) =>
    typeof child === 'string' ? hString(child) : child
  )
}
