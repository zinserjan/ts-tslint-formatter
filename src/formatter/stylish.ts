import * as os from "os";
import { RuleFailure } from "tslint";
import { FormattedRuleFailure, formatFilePath } from "../util";

const textTable = require("text-table");
const chalk = require("chalk");

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "warning": {
      return "yellow";
    }
    default: {
      return "red";
    }
  }
};

export default (ruleFailures: Array<RuleFailure>, context: string): FormattedRuleFailure => {
  const filePath = formatFilePath(ruleFailures[0].getFileName(), context);

  const message = `${textTable(
    ruleFailures.map(ruleFailure => {
      const { line, character } = ruleFailure.getStartPosition().getLineAndCharacter();

      const severity = ruleFailure.getRuleSeverity();
      const severityColor = getSeverityColor(severity);

      return [
        "",
        line + 1,
        character + 1,
        chalk[severityColor](severity),
        ruleFailure.getFailure(),
        chalk.dim(ruleFailure.getRuleName()),
      ];
    }),
    {
      align: ["", "r", "l"],
      stringLength(str: string) {
        return chalk.stripColor(str).length;
      },
    }
  )
    .split("\n")
    .map((el: string) => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.dim(`${p1}:${p2}`)))
    .join(os.EOL)}${os.EOL}`;

  return new FormattedRuleFailure(message, filePath);
};
