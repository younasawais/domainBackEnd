const express = require("express");
const app = express();
const cors = require('cors');
// if(typeof process.env.PORT === "undefined"){
//     const cors = require('cors');
//     app.use(cors());}
app.use(cors());
app.use(express.json());
require("./routes/registrationReq.js")(app);
require("./routes/fileuploadsreq.js")(app);
require("./routes/updateDataReq.js")(app);
require("./routes/stripeUpdates.js")(app);
require("./routes/emailActions.js")(app);
require("./routes/paymentReq.js")(app);
require("./routes/dataReq.js")(app);
 

/******* FrontEnd connect ********/

app.listen(process.env.PORT || 4000, () => {
    console.log("Port is listening on :" + process.env.PORT);
});
