export function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err.message)

  if (err.code === 'P2002') return res.status(409).json({ error: 'Record already exists.' })
  if (err.message?.startsWith('CORS blocked')) return res.status(403).json({ error: 'CORS policy violation.' })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body.' })
  if (err.status === 413) return res.status(413).json({ error: 'Request body too large.' })

  const status = err.statusCode || err.status || 500
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message
  res.status(status).json({ error: message })
}
