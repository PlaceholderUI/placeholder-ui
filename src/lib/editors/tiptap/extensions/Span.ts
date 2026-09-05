import { Node, mergeAttributes } from '@tiptap/core'

export interface SpanOptions {
  HTMLAttributes: Record<string, any>
}

export const Span = Node.create<SpanOptions>({
  name: 'span',

  priority: 100,

  group: 'block',

  content: 'inline*',

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
        tag: 'span',
        priority: 50,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addAttributes() {
    return {
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
    }
  },
})
