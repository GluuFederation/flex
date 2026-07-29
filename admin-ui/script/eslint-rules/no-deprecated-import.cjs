const ts = require('typescript')

const DEPRECATED_TAG = 'deprecated'

const resolveTarget = (symbol, checker) =>
  symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol

const isDeprecated = (symbol, checker) => {
  if (!symbol) return false
  const target = resolveTarget(symbol, checker)
  return [symbol, target].some((candidate) =>
    candidate.getJsDocTags(checker).some((tag) => tag.name === DEPRECATED_TAG),
  )
}

const rule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow importing deprecated symbols.' },
    messages: { deprecatedImport: '`{{name}}` is deprecated.' },
    schema: [],
  },
  create(context) {
    const services = context.sourceCode.parserServices
    if (!services?.program) return {}

    const checker = services.program.getTypeChecker()

    const report = (node, name) => {
      if (isDeprecated(services.getSymbolAtLocation(node), checker)) {
        context.report({ node, messageId: 'deprecatedImport', data: { name } })
      }
    }

    return {
      ImportSpecifier(node) {
        report(node.imported, node.imported.name ?? node.imported.value)
      },
      ImportDefaultSpecifier(node) {
        report(node.local, node.local.name)
      },
    }
  },
}

module.exports = rule
