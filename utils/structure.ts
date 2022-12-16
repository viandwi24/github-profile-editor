export const StructureComponents: StructureComponent[] = [
  {
    group: 'text',
    name: 'heading1',
    props: {
      text: {
        type: 'textarea',
        default: 'Heading 1',
      }
    }
  },
  {
    group: 'text',
    name: 'heading2',
    props: {
      text: {
        type: 'textarea',
        default: 'Heading 2',
      }
    }
  },
  {
    group: 'text',
    name: 'paragraph',
    props: {
      text: {
        type: 'textarea',
        default: 'lorem ipsum dolor sit amet'
      }
    }
  },
  {
    group: 'media',
    name: 'image',
    props: {
      alt: {
        type: 'string',
        default: 'Image'
      },
      src: {
        type: 'textarea',
        default: 'https://picsum.photos/200/300'
      }
    }
  }
]
