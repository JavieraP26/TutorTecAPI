"""
Excepciones de dominio de TutorTec.

Cada excepción tiene un mensaje legible para logs y un código HTTP sugerido.
Los handlers en error_handlers.py las convierten a respuestas JSON.
"""


class TutorTecError(Exception):
    """Base de todas las excepciones de dominio."""
    http_status: int = 500
    log_level: str = "error"

    def __init__(self, message: str, detail: str | None = None):
        super().__init__(message)
        self.message = message
        # detail es info adicional para el log (nunca se expone al usuario)
        self.detail = detail or message


class NotFoundError(TutorTecError):
    http_status = 404
    log_level = "warning"


class ConflictError(TutorTecError):
    http_status = 409
    log_level = "warning"


class ValidationError(TutorTecError):
    http_status = 400
    log_level = "warning"


class UnauthorizedError(TutorTecError):
    http_status = 401
    log_level = "warning"


class ForbiddenError(TutorTecError):
    http_status = 403
    log_level = "warning"


class ExternalServiceError(TutorTecError):
    """Error en servicio externo (Twilio, etc.)."""
    http_status = 502
    log_level = "error"
