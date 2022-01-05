import { transpile } from 'typescript'

figma.showUI(__html__, {
  width: 400,
  height: 400
})

// if (figma.editorType === 'figma') {
//   console.log('open figma')
// } else {
//   console.log('open figjam')
// }

figma.ui.onmessage = msg => {
  console.log('figma.ui.onmessage', msg)
  console.log(msg.type)
  console.log(msg.data.jsCode)

  if (msg.type === 'exec') {
    const jsCode = msg.data.jsCode
    console.log(jsCode)
    console.clear()
    eval(jsCode)
  }
}
