const {logToConsole, currentSeparate}               = require('../mods/randomFunctions');
var multer = require('multer');

module.exports = function(app){
    /******************************************************/
    /***************** Upload pdf file ********************/
    /******************************************************/
    //TODO : Send filename along with userdata after payment.
    const storage = multer.diskStorage({
        destination : "./uploads/",
        filename : function(req,file,cb){ 
            try {
                logToConsole("file", file);
                let regex = /.((pdf)|(doc)|(docx)|(jpg))$/;       
                if(regex.test(file.originalname)){
                    cb(null,currentSeparate().filetype + "-" + file.originalname);
                }else{cb(null, false);}
            } catch (error) {
                logToConsole("Error : ", error);
            }
      }
    });
      
      const upload = multer({ 
        storage: storage,
        limits: {
            fileSize: 5000000 //5 mb
          },
      }).single('file');

    app.post('/uploadpdf', function (req, res) {
        logToConsole(req.file);
        try {
            upload(req,res,function(err){
                if(err){
                  res.send(false);
                }else{ 
                  res.status(200).send(true)
                }
              })
        } catch (error) {
            res.send("error");
        }
      })
}