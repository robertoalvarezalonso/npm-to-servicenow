module.exports = function ({
  types: t
}) {
  const reservedWords = {
    delete: true,
    abstract: true,
    boolean: true,
    break: true,
    byte: true,
    case: true,
    catch: true,
    char: true,
    class: true,
    const: true,
    continue: true,
    default: true,
    do: true,
    double: true,
    else: true,
    enum: true,
    extends: true,
    false: true,
    final: true,
    finally: true,
    float: true,
    for: true,
    goto: true,
    if: true,
    implements: true,
    import: true,
    instanceof: true,
    int: true,
    interface: true,
    long: true,
    native: true,
    new: true,
    null: true,
    package: true,
    private: true,
    protected: true,
    public: true,
    return: true,
    short: true,
    static: true,
    super: true,
    switch: true,
    synchronized: true,
    this: true,
    throw: true,
    throws: true,
    transient: true,
    true: true,
    try: true,
    var: true,
    void: true,
    volatile: true,
    while: true
  };

  return {
    visitor: {
      Identifier(path) {
        //replaces references to __proto__, illegal in SN
        if (path.node.name === "__proto__") {
          path.node.name = "__proto_sn__";
        }
        if (reservedWords.hasOwnProperty(path.node.name)) { path.node.name = path.node.name + "_sn" }
      },

      IfStatement(path) {
        if (path.node.test.left?.argument?.name == "__nccwpck_require__")
          path.remove();
      },

      ExpressionStatement(path) {
        // Removes   Object.defineProperty(Constructor, "prototype", { writable: false });
        if (path.node.expression.type == "CallExpression" && path.node.expression.arguments[1]?.value == "prototype")
          path.remove();

        if (path.node.expression.type == "CallExpression" && path.node.leadingComments && path.node.leadingComments[0].value.indexOf("wrapped in an IIFE") != -1)
          path.replaceWithMultiple(path.node.expression.callee.body.body);
        //console.log(path.node.expression.callee.body)

      },
      //if a reserved word is used as a property, move it to a bracket syntax
      /* MemberExpression(path) {
        if (
          path.node.property.type === "Identifier" &&
          reservedWords.hasOwnProperty(path.node.property.name) &&
          !path.node.computed
        ) {
          const replacement = t.memberExpression(
            path.node.object,
            t.stringLiteral(path.node.property.name),
            true
          );
          path.replaceWith(replacement);
        }
      }, */
      //remove use strict
      Program: {
        exit: function exit(path) {
          const list = path.node.directives;
          for (let i = list.length - 1, it; i >= 0; i--) {
            it = list[i];
            if (it.value.value === 'use strict') {
              list.splice(i, 1);
            }
          }
        }
      }
    }
  }
}
