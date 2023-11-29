const cantFind = (req,res) => res.status(404).send('The page you were looking for does not exist')

module.exports = cantFind