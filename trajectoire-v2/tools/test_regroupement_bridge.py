import json
import tempfile
import unittest
from pathlib import Path

from regroupement_bridge import validate_url, load_manifest, run


class BridgeTests(unittest.TestCase):
    def test_public_https_only(self):
        self.assertEqual(validate_url("https://developer.mozilla.org/fr/docs/")[1], "developer.mozilla.org")
        for url in ["http://example.com", "file:///tmp/x", "https://localhost/x",
                    "https://127.0.0.1/private", "https://user:pass@example.com",
                    "https://example.com:8443", "https://site.local/x"]:
            with self.assertRaises(ValueError):
                validate_url(url)

    def test_manifest_and_safe_offline_mode(self):
        doc = {
            "schema": "regroupement-trajectoire-v1",
            "objective": "Apprendre JavaScript",
            "dry_run": True,
            "auto_execute": False,
            "sources": [{"url": "https://developer.mozilla.org/fr/docs/Web/JavaScript",
                         "type": "web", "title": "MDN", "notes": "DOM"}]
        }
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "sources.json"
            p.write_text(json.dumps(doc), encoding="utf-8")
            data = load_manifest(p)
            result = run(data, fetch=False)
            self.assertEqual(result["schema"], "regroupement-extraction-v1")
            self.assertTrue(result["dry_run"])
            self.assertFalse(result["executed"])
            self.assertEqual(result["ai_provider"], "aucun")
            self.assertEqual(result["resources"][0]["status"], "non-extrait")

    def test_no_auto_execution_manifest(self):
        invalid = {
            "schema": "regroupement-trajectoire-v1",
            "objective": "test",
            "dry_run": False,
            "auto_execute": True,
            "sources": []
        }
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "unsafe.json"
            p.write_text(json.dumps(invalid), encoding="utf-8")
            with self.assertRaises(ValueError):
                load_manifest(p)


if __name__ == "__main__":
    unittest.main()
