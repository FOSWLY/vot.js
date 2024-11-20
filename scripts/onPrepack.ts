import { version } from "../package.json";
import { updatePackageVersions } from "./utils";

await updatePackageVersions(`^${version}`);
