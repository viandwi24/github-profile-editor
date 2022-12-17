interface StructureItem {
  id: string
  component: string
  group: string
  props: {
    [key: string]: any
  },
  children?: StructureItem[]
}

interface StructureComponent {
  group: string
  name: string
  props?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'textarea' | 'select'
      default: any
      options?: any[]
    }
  }
  allowChildren?: boolean
  display: 'block' | 'inline' | 'inline-block'
  hooks?: {
    event: 'onParse'
    callback: (...args: any[]) => any
  }[]
}
