const   express     = require('express'),
        bodyParser  = require('body-parser');

const userRoutes = require('./routes/users');
const imageUploadRoutes = require('./routes/image-upload');
const toolsRoutes = require('./routes/tools');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', imageUploadRoutes);
app.use('/api/v1/tools', toolsRoutes);
const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
console.log('Server started ...')
});
