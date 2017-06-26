import * as path from "path";
import { RuleFailure } from "tslint";
import normalizePath = require("normalize-path");
import Es6Error = require("es6-error");

export interface GroupedRuleFailures {
  [fileName: string]: Array<RuleFailure>;
}

export interface Formatter {
  (ruleFailures: Array<RuleFailure>, context: string): FormattedRuleFailure;
}

export class FormattedRuleFailure extends Es6Error {
  file?: string;

  constructor(message: string, file: string) {
    super(message);
    this.file = file;
  }
}

export const groupByFile = (ruleFailures: Array<RuleFailure>): GroupedRuleFailures => {
  return ruleFailures.reduce((groups: GroupedRuleFailures, ruleFailure: RuleFailure) => {
    const fileName = ruleFailure.getFileName();
    if (!groups[fileName]) {
      groups[fileName] = [];
    }
    groups[fileName].push(ruleFailure);
    return groups;
  }, {} as GroupedRuleFailures);
};

export const formatFilePath = (filePath: string, context: string) => {
  let fileName = normalizePath(path.relative(context, filePath));
  if (fileName && fileName[0] !== ".") {
    fileName = `./${fileName}`;
  }
  return fileName;
};
