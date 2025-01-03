import { exec } from "child_process";

const tscAlias = () => {
  return {
    name: "tsAlias",
    writeBundle: () => {
      return new Promise((resolve, reject) => {
        exec("tsc-alias", function callback(error, stdout, stderr) {
          if (stderr || error) {
            reject(stderr || error);
          } else {
            resolve(stdout);
          }
        });
      });
    },
  };
};

export default tscAlias;
