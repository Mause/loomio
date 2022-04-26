import { last } from "lodash";
import {
  CallExpression,
  ExportDeclarationStructure,
  Project,
  SourceFile,
  StructureKind,
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
      try {
        fixFile(sf);
      } catch (e) {
        console.log("failed to rewrite", sf.getBaseName());
        throw e;
      }
      sf.saveSync();
    }
    console.timeEnd(sf.getBaseName());
  }
}

function fixFile(sf: SourceFile) {
  const right = sf.getExportedDeclarations().get("default")![0]!;

  let call: CallExpression;
  if (right.getKind() == SyntaxKind.Identifier) {
    throw new Error();
  } else if (right.getKind() == SyntaxKind.CallExpression) {
    call = right.asKindOrThrow(SyntaxKind.CallExpression);
  } else if (right.getKind() == SyntaxKind.VariableDeclaration) {
    call = right
      .asKindOrThrow(SyntaxKind.VariableDeclaration)
      .getInitializerIfKindOrThrow(SyntaxKind.CallExpression);
  } else {
    throw new Error(right.getKindName());
  }

  const args = call.getArguments();
  if (args.length !== 1) throw new Error();

  const theReplacement = args[0];

  call.replaceWithText(theReplacement!.print());
}

rewrite();
