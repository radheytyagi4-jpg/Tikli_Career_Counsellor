import app from "./app.js";
import connect_DB from "./config/index.js";

const PORT = process.env.PORT || 4000;

connect_DB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});