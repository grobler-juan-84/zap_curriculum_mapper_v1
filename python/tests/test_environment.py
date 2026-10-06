import unittest
from pathlib import Path


class EnvironmentTests(unittest.TestCase):
    def test_python_tooling_layout_exists(self) -> None:
        root = Path(__file__).resolve().parents[1]
        self.assertTrue((root / "validation").is_dir())
        self.assertTrue((root / "processing").is_dir())
        self.assertTrue((root / "pyproject.toml").is_file())


if __name__ == "__main__":
    unittest.main()
