import { Node, mergeAttributes } from '@tiptap/core'

export interface DivOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    div: {
      /**
       * Set the current node as a div
       */
      setDiv: () => ReturnType
      /**
       * Toggle between div and paragraph
       */
      toggleDiv: () => ReturnType
    }
  }
}

export const Div = Node.create<DivOptions>({
  name: 'div',
  group: 'block',
  content: 'block*',
  isolating: false,
  defining: false,
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        // Preserve all attributes
        getAttrs: (node) => {
          if (typeof node === 'string') return false
          const element = node as HTMLElement
          // Skip if it's an alert or other custom node with data-type
          if (element.getAttribute('data-type')) return false

          // Preserve all attributes
          const attrs: Record<string, any> = {}
          Array.from(element.attributes).forEach(attr => {
            attrs[attr.name] = attr.value
          })

          return attrs
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setDiv:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name)
        },
      toggleDiv:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph')
        },
    }
  },

  addAttributes() {
    return {
      // Preserve all HTML attributes
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) return {}
          return { class: attributes.class }
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) return {}
          return { style: attributes.style }
        },
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) return {}
          return { id: attributes.id }
        },
      },
      'data-type': {
        default: null,
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes['data-type']) return {}
          return { 'data-type': attributes['data-type'] }
        },
      },
    }
  },
})
