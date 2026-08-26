// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// https://www.w3.org/TR/SVGTiny12/attributeTable.html#PropertyTable
// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
// https://developer.mozilla.org/en-US/docs/Glossary/IDL

export type AttributeValue = string | number | boolean | null

export type CSSPropertyName = {
  [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string
    ? K extends string
      ? K
      : never
    : never
}[keyof CSSStyleDeclaration]

export type StyleProps = Partial<Record<CSSPropertyName, string>>

export type Attributes = {
  class?: string | string[]
  style?: StyleProps
  key?: string | number
  [name: string]: unknown
}

type WritableElement = HTMLElement & Record<string, unknown>

/**
 * Sets the attributes of an element.
 *
 * It doesn't remove attributes that are not present in the new attributes,
 * except in the case of the `class` attribute.
 */
export function setAttributes(el: HTMLElement, attrs: Attributes) {
  const { class: className, style, ...otherAttrs } = attrs

  // Delete the "key" property if it exists
  delete otherAttrs.key

  if (className) {
    setClass(el, className)
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop as CSSPropertyName, value as string)
    })
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value as AttributeValue)
  }
}

/**
 * Sets the attribute on the element.
 */
export function setAttribute(
  el: HTMLElement,
  name: string,
  value: AttributeValue
) {
  if (value == null) {
    removeAttribute(el, name)
  } else if (name.startsWith('data-')) {
    el.setAttribute(name, String(value))
  } else {
    (el as WritableElement)[name] = value
  }
}

/**
 * Removes the attribute from the element.
 */
export function removeAttribute(el: HTMLElement, name: string) {
  try {
    (el as WritableElement)[name] = null
  } catch {
    // Setting 'size' to null on an <input> throws an error.
    // Removing the attribute instead works. (Done below.)
    console.warn(`Failed to set "${name}" to null on ${el.tagName}`)
  }

  el.removeAttribute(name)
}

export function setStyle(
  el: HTMLElement,
  name: CSSPropertyName,
  value: string
) {
  el.style[name] = value
}

export function removeStyle(el: HTMLElement, name: CSSPropertyName) {
  (el.style as Record<CSSPropertyName, string | null>)[name] = null
}

function setClass(el: HTMLElement, className: string | string[]) {
  el.className = ''

  if (typeof className === 'string') {
    el.className = className
  }

  if (Array.isArray(className)) {
    el.classList.add(...className)
  }
}
