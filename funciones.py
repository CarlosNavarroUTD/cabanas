import hashlib

def hash_password(password):
    """Encripta una contraseña utilizando SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()