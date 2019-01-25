const   express     = require('express'),
        bodyParser  = require('body-parser');

const userRoutes = require('./routes/users');
const imageUploadRoutes = require('./routes/image-upload');
const toolsRoutes = require('./routes/tools');
const profilesRoutes = require('./routes/profiles');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', imageUploadRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/profiles', profilesRoutes);
const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
console.log('Server started ...')
});
