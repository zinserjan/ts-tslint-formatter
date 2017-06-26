import { RuleFailure } from "tslint";
import { Formatter, FormattedRuleFailure, groupByFile } from "./util";
import stylish from "./formatter/stylish";

export { FormattedRuleFailure };

export default function format(ruleFailures: Array<RuleFailure>, format: string, context: string = process.cwd()) {
  let formatter: Formatter;

  switch (format) {
    case "stylish": {
      formatter = stylish;
      break;
    }
    default: {
      throw new Error(`Formatter '${format}' is not supported.`);
    }
  }

  const groupedByFile = groupByFile(ruleFailures);
  return Object.keys(groupedByFile)
    .map(file => groupedByFile[file])
    .map(ruleFailures => formatter(ruleFailures, context));
}
