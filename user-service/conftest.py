# user-service/conftest.py
import sys, os

# prepend src/ to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))
