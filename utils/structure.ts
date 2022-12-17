export namespace StructureComponents {
  export const LayoutContainer: StructureComponent = {
    group: 'layout',
    name: 'container',
    allowChildren: true,
    display: 'block',
    props: {
      // width: {
      //   type: 'string',
      //   default: '100%'
      // },
      textAlign: {
        type: 'select',
        default: 'left',
        options: ['left', 'center', 'right']
      },
    },
    hooks: [
      {
        event: 'onParse',
        callback: (item: StructureItem, def: StructureComponent, runParseHook: (e: any) => string): string => {
          return `<p id="${item.id}" align="${item.props.textAlign}">${runParseHook(item.children || [])}</p>`
        }
      }
    ]
  }
  export const MediaImage: StructureComponent = {
    group: 'media',
    name: 'image',
    display: 'inline-block',
    props: {
      alt: {
        type: 'string',
        default: 'Image'
      },
      src: {
        type: 'textarea',
        default: 'https://picsum.photos/300/300'
      },
      width: {
        type: 'string',
        default: '30%'
      },
      height: {
        type: 'string',
        default: 'auto'
      }
    },
    hooks: [
      {
        event: 'onParse',
        callback: (item: StructureItem, def: StructureComponent, runParseHook: (e: any) => string): string => {
          return `<img id="${item.id}" src="${item.props.src}" alt="${item.props.alt}" width="${item.props.width}" height="${item.props.height}">`
        }
      }
    ]
  }
  export const TextHeading1: StructureComponent = {
    group: 'text',
    name: 'heading1',
    display: 'block',
    props: {
      text: {
        type: 'textarea',
        default: 'Heading 1',
      }
    },
    hooks: [
      {
        event: 'onParse',
        callback: (item: StructureItem, def: StructureComponent, runParseHook: (e: any) => string): string => {
          return `<h1 id="${item.id}">${item.props.text}</h1>`
        }
      }
    ]
  }
  export const TextHeading2: StructureComponent = {
    group: 'text',
    name: 'heading2',
    display: 'block',
    props: {
      text: {
        type: 'textarea',
        default: 'Heading 2',
      }
    },
    hooks: [
      {
        event: 'onParse',
        callback: (item: StructureItem, def: StructureComponent, runParseHook: (e: any) => string): string => {
          return `<h2 id="${item.id}">${item.props.text}</h2>`
        }
      }
    ]
  }
  export const TextParagraph: StructureComponent = {
    group: 'text',
    name: 'paragraph',
    display: 'inline-block',
    props: {
      text: {
        type: 'textarea',
        default: 'lorem ipsum dolor sit amet'
      }
    },
    hooks: [
      {
        event: 'onParse',
        callback: (item: StructureItem, def: StructureComponent, runParseHook: (e: any) => string): string => {
          return `<p id="${item.id}">${item.props.text}</p>`
        }
      }
    ]
  }
}

export const RegisteredStructureComponents: StructureComponent[] = [
  StructureComponents.LayoutContainer,
  StructureComponents.TextHeading1,
  StructureComponents.TextHeading2,
  StructureComponents.TextParagraph,
  StructureComponents.MediaImage,
]

export const ParseStructure = (items: StructureItem[]) => {
  let res = ''

  const runParseHook = (item: StructureItem|StructureItem[]) => {
    if (Array.isArray(item)) {
      let res = ''
      item.forEach(i => {
        const parsedItem = runParseHook(i)
        if (!parsedItem) return
        res += `${parsedItem}\n`
      })
      return res
    }

    const componentDef = RegisteredStructureComponents.find(c => c.group === item.group && c.name === item.component)
    if (!componentDef) return
    if (!componentDef.hooks || componentDef.hooks.length === 0) return

    const haveHookParse = componentDef.hooks.find(h => h.event === 'onParse')
    if (!haveHookParse) return

    const parsedItem = haveHookParse.callback(item, componentDef, runParseHook) as string
    if (!parsedItem) return

    return parsedItem
  }

  items.forEach(item => {
    try {
      const parsedItem = runParseHook(item)
      if (!parsedItem) return
      res += `${parsedItem}\n`
    } catch (error) {
      console.error(`Error while parsing item ${item.id}:\n${error}`)
      return
    }
  })
  return res
}
