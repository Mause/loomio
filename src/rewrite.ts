import { last } from "lodash";
import { Project, SyntaxKind } from "ts-morph";

function rewrite() {
  const proj = new Project({ tsConfigFilePath: "dist/tsconfig.json" });

  const dir = proj.getDirectories()[0]!;
  const sf = dir.getSourceFileOrThrow("loomio.app.js");

  const target1 = sf.getChildren()[0]!;
  const target2 = last(target1.getChildren())!;

  const binexp = target2.getChildrenOfKind(SyntaxKind.BinaryExpression)[0]!;

  const ref = binexp
    .getRight()!
    .asKindOrThrow(SyntaxKind.Identifier)
    .findReferences()[0]!;

  const def = ref
    .getDefinition()
    .getDeclarationNode()!
    .asKindOrThrow(SyntaxKind.VariableDeclaration);

  const call = def.getInitializerIfKindOrThrow(SyntaxKind.CallExpression);

  console.log(call.getExpression().print());

  const args = call.getArguments();
  if (args.length !== 1) throw new Error();

  const theReplacement = args[0];

  binexp.getRight()!.replaceWithText(theReplacement!.print());

  console.log(sf.print());
}

rewrite();
