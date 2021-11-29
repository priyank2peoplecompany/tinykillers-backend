const DB_DETAILS = {
	"local": {
		"db_host": "mongodb+srv",
		"db_name": "Tinykillers",
		"db_username": "tinkillers_user",
		"db_password": "3EZWfzHbFd9vfBAP", //tinykiller123@# 
		"db_dialect": "",
		"multipleStatements": true
	},
	"development": {
		"db_host": "127.0.0.1:27017",
		"db_name": "tinykillers",
		"db_username": "root",
		"db_password": "",
		"db_dialect": "",
		"multipleStatements": true
	},
	"production": {
		"db_host": "",
		"db_name": "",
		"db_username": "",
		"db_password": "",
		"db_dialect": "",
		"multipleStatements": true
	}
}

const env_db = DB_DETAILS[process.env.NODE_ENV]; 

//mongoose.connect(`${env_db.db_host}://${env_db.db_username}:${env_db.db_password}@tinykillers.nxvir.mongodb.net/${env_db.db_name}?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connect(`mongodb://${env_db.db_host}//${env_db.db_name}`, { useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
	console.log("Connected successfully");
});