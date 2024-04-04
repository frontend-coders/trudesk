
const serversController = {}

serversController.content = {}

serversController.get = function (req, res) {
  const content = {}
  content.title = 'Servers'
  content.nav = 'servers'
  content.data = {}
  content.data.user = req.user
  content.data.common = req.viewdata

  res.render('servers', content)
}

module.exports = serversController
