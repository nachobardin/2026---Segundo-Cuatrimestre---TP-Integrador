// Revisamos si hay un administrador que inicio sesion, y si no lo hay, lo redirigimos al login
export function requireAuth(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }
    next();
}
