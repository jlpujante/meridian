import os
from dotenv import load_dotenv

load_dotenv()

def is_debug_mode():
    return os.environ.get('DEBUG') == 'True' or os.environ.get('DEBUG') == 'true'


def get_env_var(name=None):
    if name:
        return os.environ.get(name)