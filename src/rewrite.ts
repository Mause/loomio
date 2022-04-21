import { last } from "lodash";
import { Project, SourceFile, SyntaxKind } from "ts-morph";

const ALLOW_LIST = new Set(["loomio.app", "create-poll", "create-discussion"]);

function rewrite() {
  const proj = new Project({ tsConfigFilePath: "dist/tsconfig.json" });

  const dir = proj.getDirectories()[0]!;

  for (const sf of dir.getSourceFiles()) {
    if (ALLOW_LIST.has(sf.getBaseNameWithoutExtension())) {
      console.time(sf.getBaseName());
      fixFile(sf);
      sf.saveSync();
      console.timeEnd(sf.getBaseName());
    }
  }
}

function fixFile(sf: SourceFile) {
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
