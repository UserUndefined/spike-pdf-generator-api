
exports.generatePdf = function(req, res){
  console.log('generatePdf called');
  res.render('index', { title: 'Express' });
};