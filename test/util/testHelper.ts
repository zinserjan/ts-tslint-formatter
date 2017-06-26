import * as path from "path";
import * as fs from "fs";
import {
  SourceFile,
  Diagnostic,
  createCompilerHost,
  createProgram,
  readConfigFile,
  parseJsonConfigFileContent,
  sys,
} from "typescript";
import { Configuration, Linter, RuleFailure } from "tslint";

export const getRuleFailures = (tsconfigPath: string, tslintPath: string) => {
  const config = readConfigFile(tsconfigPath, sys.readFile).config;
  const tslintConfig = Configuration.loadConfigurationFromPath(tslintPath);
  const programConfig = parseJsonConfigFileContent(config, sys, path.dirname(tsconfigPath));
  const host = createCompilerHost(programConfig.options);
  const program = createProgram(programConfig.fileNames, programConfig.options, host);
  const filesToLint: Array<SourceFile> = program.getSourceFiles();

  const linter = new Linter({ fix: false });

  filesToLint.filter((file: SourceFile) => !/node_modules/.test(file.fileName)).forEach((file: SourceFile) => {
    linter.lint(file.fileName, file.text, tslintConfig);
  });

  return linter.getResult().failures;
};

const fixturePath = path.join(__dirname, "../fixture");

export const getTsConfigs = () => {
  const dirs = fs.readdirSync(fixturePath);
  return dirs.map(dir => path.join(fixturePath, dir, "tsconfig.json"));
};
