import { last } from "lodash";
import {
  CallExpression,
  Project,
  SourceFile,
  SyntaxKind,
  VariableDeclaration,
} from "ts-morph";

const ALLOW_LIST = new Set(["loomio.app", "create-poll", "create-discussion"]);

function rewrite() {
  console.time("loading project");
  const proj = new Project({ tsConfigFilePath: "dist/tsconfig.json" });
  console.timeEnd("loading project");

  const dir = proj.getDirectories()[0]!;

  for (const sf of dir.getDescendantSourceFiles()) {
    console.time(sf.getBaseName());
    if (ALLOW_LIST.has(sf.getBaseNameWithoutExtension())) {
      fixFile(sf);
      sf.saveSync();
    }
    console.timeEnd(sf.getBaseName());
  }
}

function fixFile(sf: SourceFile) {
  const binexp = sf
    .getFirstDescendantOrThrow((node) => {
      const isbin = node.getKind() === SyntaxKind.BinaryExpression;

      return !!(
        isbin &&
        node.asKindOrThrow(SyntaxKind.BinaryExpression).getLeft().print() ==
          "exports.default"
      );
    })
    .asKindOrThrow(SyntaxKind.BinaryExpression);

  const right = binexp.getRight()!;

  let call: CallExpression;
  if (right.getKind() == SyntaxKind.Identifier) {
    const ref = right.asKindOrThrow(SyntaxKind.Identifier).findReferences()[0]!;

    const def = ref
      .getDefinition()
      .getDeclarationNode()!
      .asKindOrThrow(SyntaxKind.VariableDeclaration);
    call = def.getInitializerIfKindOrThrow(SyntaxKind.CallExpression);
  } else if (right.getKind() == SyntaxKind.CallExpression) {
    call = right.asKindOrThrow(SyntaxKind.CallExpression);
  } else {
    throw new Error();
  }

  //console.log(call.getExpression().print());

  const args = call.getArguments();
  if (args.length !== 1) throw new Error();

  const theReplacement = args[0];

  binexp.getRight()!.replaceWithText(theReplacement!.print());

  //console.log(sf.print());
}

rewrite();
