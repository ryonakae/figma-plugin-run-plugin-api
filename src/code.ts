figma.showUI(__html__, {
  width: 400,
  height: 400
})

if (figma.editorType === 'figma') {
  console.log('open figma')
} else {
  console.log('open figjam')
}
