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

  console.log("sanitizer")

  return {
    visitor: {
      Identifier(path) {
        //replaces references to __proto__, illegal in SN
        if (path.node.name === "__proto__") {
          path.node.name = "__proto_sn__";
        }
        if (reservedWords.hasOwnProperty(path.node.name)) { path.node.name = path.node.name + "_sn" }
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