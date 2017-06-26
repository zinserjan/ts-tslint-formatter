import * as os from "os";
import * as path from "path";
import { getTsConfigs, getRuleFailures } from "./util/testHelper";
import format from "../src/index";
const chalk = require("chalk");

const formatters = ["stylish"];
const tsconfigs = getTsConfigs();

formatters.forEach(formatter => {
  describe(`${formatter} formatter`, () => {
    tsconfigs.forEach((tsConfigPath: string) => {
      const dir = path.basename(path.dirname(tsConfigPath));
      const tslintConfig = path.join(path.dirname(tsConfigPath), "tslint.json");

      it(dir, () => {
        const failures = getRuleFailures(tsConfigPath, tslintConfig);
        const formattedFailures = format(failures, formatter);

        formattedFailures.forEach(formatted => {
          formatted.message = formatted.message.replace(os.EOL, "\n");
          expect({ file: formatted.file, message: formatted.message }).toMatchSnapshot();
        });
      });
    });
  });
});
