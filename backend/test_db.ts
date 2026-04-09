import { connectDB } from './src/db/index';

const test = async () => {
    try {
        console.log("Testing DB connection to Azure...");
        await connectDB();
        console.log("Success!");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}
test();
