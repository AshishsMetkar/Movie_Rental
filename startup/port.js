
function port(app){
if(process.env.NODE_ENV!=="test"){
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}
}

module.exports = port;