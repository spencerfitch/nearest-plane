import dotenv from 'dotenv';
import express from 'express';
import routes from './src/routes';
import * as middleware from './config/middleware';

dotenv.config();
const app = express();

const bodyConfig = {
    limit: "10mb",
    extended: true
}
app.use(express.urlencoded(bodyConfig));
app.use(express.json(bodyConfig));

app.use(middleware.cors);

app.use("", routes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Application listening on PORT: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
