# debug_import.py
import traceback

print("Python:", __import__("sys").version)
print("CWD:", __import__("os").getcwd())
print("Attempting to import backend.main ...")

try:
    import backend.main
    print("IMPORT OK: backend.main imported successfully")
except Exception:
    print("IMPORT FAILED — full traceback below:\n")
    traceback.print_exc()
