import * as path from "path";
import { getTsConfigs, getRuleFailures } from "./util/testHelper";
import format from "../src/index";

const formatters = ["stylish"];

formatters.forEach(formatter => {
  console.log(formatter);
  console.log("------");
  getTsConfigs().forEach((tsConfigPath: string) => {
    const tslintConfig = path.join(path.dirname(tsConfigPath), "tslint.json");

    const failures = getRuleFailures(tsConfigPath, tslintConfig);
    const formattedFailures = format(failures, formatter);

    formattedFailures.forEach(formatted => {
      console.log(formatted.file);
      console.log(formatted.message);
    });
  });
});
