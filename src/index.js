import "dotenv/config";
import app from "./app.js";

import { PORT } from "./common/constants/constants.js";

app.listen(PORT, () => console.log("Server is running on port", PORT));
