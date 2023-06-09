module.exports = function ({
  types: t
}) {
  function genLocString(comment) {
    return `c${comment.loc.start.column}l${comment.loc.start.line}`;
  }
  function getCommentTags(path) {
    let node = path.node;
    let comments = "";
    if (node.leadingComments && node.leadingComments.length > 0) {
      comments = node.leadingComments
        .filter(comment => {
          return !commentUsageTracker.has(genLocString(comment));
        })
        .reduce((acc, comment) => {
          commentUsageTracker.add(genLocString(comment));
          acc += comment.value;
          return acc;
        }, "");
    }
    const tags = new Map();
    const tagRegex = /@\w+\s*=?\s*\w+/g;
    let matches = comments.match(tagRegex);
    if (matches) {
      for (let match of matches) {
        if (match.includes("=")) {
          let chunks = match.split("=");
          let tag = chunks[0].trim().substring(1);
          let value = chunks[1].trim();
          tags.set(tag, value);
        } else {
          tags.set(match.substring(1), true);
        }
      }
    }
    return tags;
  }
  function renameAllImports(
    moduleName,
    _imports,
    path
  ) {
    for (let _import of _imports) {
      path.scope.rename(_import, [moduleName, _import].join("."));
    }
  }
  return {
    visitor: {
      //remove imports
      ImportDeclaration(path) {
        //get comment tags
        const tags = getCommentTags(path);
        //should we remove?
        if (tags.has("keepModule")) {
          //no we shouldn't
          return;
        }
        //load all imported modules
        let _imports = path.node.specifiers.reduce(
          (acc, cur) => {
            if (cur.type === "ImportSpecifier") {
              acc.push(cur.imported.name);
            }
            if (cur.type === "ImportDefaultSpecifier") {
              acc.push(cur.local.name);
            }
            return acc;
          },
          []
        );
        //yes we should remove
        //should we expand?
        if (tags.has("expandModule")) {
          //do we have an alias?
          if (tags.has("moduleAlias")) {
            //expand with alias
            const aliasName = tags.get("moduleAlias");
            renameAllImports(aliasName, _imports, path);
          } else {
            //expand using module name
            const moduleName = path.node.source.value;
            renameAllImports(moduleName, _imports, path);
          }
        }
        //remove import path
        path.remove();

        function isLocal(moduleName) {
          let reg = /\./;
          return reg.test(moduleName);
        }
      },
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          path.replaceWith(path.node.declaration);
        } else {
          path.remove();
        }
      },
      ExportDefaultDeclaration(path) {
        let type = path.node.declaration.type;
        if (type === "FunctionDeclaration") {
          //anonymous function
          if (!(path.node.declaration).id) {
            (path.node
              .declaration).id = path.scope.generateUidIdentifier();
          }
          path.replaceWith(path.node.declaration);
          return;
        }
        if (type === "Identifier") {
          path.remove();
          return;
        }
        if (type === "ClassDeclaration") {
          if (!(path.node.declaration).id) {
            (path.node
              .declaration).id = path.scope.generateUidIdentifier();
          }
          path.replaceWith(path.node.declaration);
          return;
        }
        //fallback remove it
        path.remove();
      }
    }
  }
}