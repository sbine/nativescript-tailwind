const postcss = require('postcss')

function isSupportedProperty(prop, val = null) {
  const rules = supportedProperties[prop]
  if (!rules) return false

  if (val) {
    if (val.endsWith('vh') || val.endsWith('vw') || val.endsWith('em')) {
      return false
    }

    if (Array.isArray(rules)) {
      return rules.includes(val)
    }
  }

  return true
}

function isSupportedRule(selector) {
  if (selector.endsWith(':hover') || selector.endsWith(':focus')) {
    return false
  }

  return true
}

module.exports = postcss.plugin('postcss-nativescript', () => {
  return root => {
    root.walkRules(rule => {
      if (rule.parent.name === 'media') {
        rule.parent.remove()
      }

      if (!isSupportedRule(rule.selector)) {
        rule.remove()
      }

      rule.walkDecls(decl => {
        if (decl.prop === 'visibility') {
          switch (decl.value) {
            case 'hidden':
              decl.replaceWith(decl.clone({ value: 'collapse'}))
              return
          }
        }

        if (decl.prop === 'vertical-align') {
          switch (decl.value) {
            case 'middle':
              decl.replaceWith(decl.clone({ value: 'center'}))
              return
          }
        }

        if (!isSupportedProperty(decl.prop, decl.value)) {
          // console.log('removing ', decl.prop, decl.value)
          rule.removeChild(decl)

          if (rule.nodes.length === 0) {
            rule.remove()
          }
        }
      })
    })
  }
})

const supportedProperties = {
  'color': true,
  'background': true,
  'background-color': true,
  'placeholder-color': true,
  'background-image': true,
  'background-repeat': ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
  'background-position': true,
  'background-size': true,
  'border-color': true,
  'border-top-color': true,
  'border-right-color': true,
  'border-bottom-color': true,
  'border-left-color': true,
  'border-width': true,
  'border-top-width': true,
  'border-right-width': true,
  'border-bottom-width': true,
  'border-left-width': true,
  'border-radius': true,
  'border-top-left-radius': true,
  'border-top-right-radius': true,
  'border-bottom-right-radius': true,
  'border-bottom-left-radius': true,
  'font': true,
  'font-family': true,
  'font-size': true,
  'font-style': ['italic', 'normal'],
  'font-weight': true,
  'text-align': ['left', 'center', 'right'],
  'text-decoration': ['none', 'line-through', 'underline'],
  'text-transform': ['none', 'capitalize', 'uppercase', 'lowercase'],
  'letter-spacing': true,
  'line-height': true,
  'z-index': true,
  'clip-path': true,
  'vertical-align': ['top', 'center', 'bottom', 'stretch'],
  'horizontal-align': ['left', 'center', 'right', 'stretch'],
  'margin': true,
  'margin-top': true,
  'margin-right': true,
  'margin-bottom': true,
  'margin-left': true,
  'width': true,
  'height': true,
  'min-width': true,
  'min-height': true,
  'padding': true,
  'padding-top': true,
  'padding-right': true,
  'padding-bottom': true,
  'padding-left': true,
  'visibility': ['visible', 'collapse'],
  'opacity': true,
}
