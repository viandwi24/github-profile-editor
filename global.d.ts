interface StructureItem {
  id: string
  component: string
  group: string
  props: {
    [key: string]: any
  }
}

interface StructureComponent {
  group: string
  name: string
  props?: {
    [key: string]: {
      type: 'string' | 'number' | 'boolean' | 'textarea'
      default: any
    }
  }
}
