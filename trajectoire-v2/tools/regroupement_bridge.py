#!/usr/bin/env python3
"""Trajectoire ↔ Regroupement: import *local et facultatif* des sources.

Usage (aucune requête réseau) :
  python3 tools/regroupement_bridge.py --manifest sources.json --output analyse.json
Pour une extraction explicite et limitée à des domaines choisis :
  pip install requests beautifulsoup4 youtube-transcript-api
  python3 tools/regroupement_bridge.py --manifest sources.json --output analyse.json --fetch --allow-host developer.mozilla.org

Aucune clé d'API, aucune exécution de commande issue d'un document.
"""
import argparse
import datetime as dt
import ipaddress
import json
import re
import socket
import sys
from pathlib import Path
from urllib.parse import urlsplit


MAX_FILE = 1_000_000
MAX_ITEMS = 20
MAX_BYTES = 150_000
MAX_EXCERPT = 1600
USER_AGENT = "TrajectoireSources/0.1 (manual opt-in, non-commercial)"


def is_public_host(host: str) -> bool:
    host = host.lower().rstrip(".")
    if not host or "." not in host or host.endswith((".local", ".internal", ".localhost", ".test", ".invalid")):
        return False
    if host in {"localhost", "0.0.0.0"}:
        return False
    try:
        return ipaddress.ip_address(host).is_global
    except ValueError:
        return True


def validate_url(text: str) -> tuple[str, str]:
    if not isinstance(text, str) or len(text) > 800:
        raise ValueError("URL absente ou trop longue")
    parsed = urlsplit(text.strip())
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Seules les URL HTTPS publiques sans identifiants sont permises")
    if parsed.port and parsed.port != 443:
        raise ValueError("Port HTTPS non standard interdit")
    host = parsed.hostname.rstrip(".").lower()
    if not is_public_host(host):
        raise ValueError("Adresse locale ou privée interdite")
    return text.strip(), host


def resolve_public(host: str) -> None:
    """Contrôle DNS préliminaire. Ne prétend pas éliminer tout DNS rebinding."""
    addresses = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    if not addresses:
        raise ValueError("Aucune adresse réseau")
    for info in addresses:
        if not ipaddress.ip_address(info[4][0]).is_global:
            raise ValueError("Une adresse DNS n'est pas publique")


def fetch_text(url: str, host: str) -> tuple[str, str]:
    import requests
    from bs4 import BeautifulSoup

    resolve_public(host)
    with requests.get(url, timeout=(4, 9), allow_redirects=False, stream=True,
                      headers={"User-Agent": USER_AGENT, "Accept": "text/html,text/plain"}) as response:
        if response.status_code in (301, 302, 303, 307, 308):
            raise ValueError("Redirection refusée : ajouter explicitement l'URL finale")
        response.raise_for_status()
        ctype = response.headers.get("Content-Type", "").lower()
        if not ("text/html" in ctype or "text/plain" in ctype):
            raise ValueError("Type non supporté : " + ctype[:100])
        chunks = []
        total = 0
        for chunk in response.iter_content(chunk_size=4096):
            total += len(chunk)
            if total > MAX_BYTES:
                raise ValueError("Source trop volumineuse (> 150 Ko)")
            chunks.append(chunk)
        raw = b"".join(chunks).decode(response.encoding or "utf-8", errors="replace")
    if "html" not in ctype:
        return url, " ".join(raw.split())[:MAX_EXCERPT]
    soup = BeautifulSoup(raw, "html.parser")
    for bad in soup(["script", "style", "noscript", "svg", "nav", "footer"]):
        bad.decompose()
    title = (soup.title.get_text(" ", strip=True) if soup.title else url)[:150]
    return title, " ".join(soup.get_text(" ", strip=True).split())[:MAX_EXCERPT]


def fetch_youtube(url: str) -> tuple[str, str]:
    from urllib.parse import parse_qs
    from youtube_transcript_api import YouTubeTranscriptApi

    parsed = urlsplit(url)
    if parsed.hostname in ("youtube.com", "www.youtube.com", "m.youtube.com"):
        video_id = parse_qs(parsed.query).get("v", [""])[0]
    elif parsed.hostname == "youtu.be":
        video_id = parsed.path.strip("/").split("/")[0]
    else:
        raise ValueError("Domaine YouTube non pris en charge")
    if not re.fullmatch(r"[a-zA-Z0-9_-]{11}", video_id):
        raise ValueError("Identifiant YouTube invalide")
    api = YouTubeTranscriptApi()
    if hasattr(api, "fetch"):
        data = api.fetch(video_id, languages=["fr", "en"])
        transcript = " ".join(item.text for item in data)
    else:
        data = YouTubeTranscriptApi.get_transcript(video_id, languages=["fr", "en"])
        transcript = " ".join(item["text"] for item in data)
    return "YouTube " + video_id, transcript[:MAX_EXCERPT]


def load_manifest(path: Path) -> dict:
    if path.stat().st_size > MAX_FILE:
        raise ValueError("Manifeste trop volumineux")
    doc = json.loads(path.read_text(encoding="utf-8"))
    if doc.get("schema") != "regroupement-trajectoire-v1" or doc.get("dry_run") is not True or doc.get("auto_execute") is not False:
        raise ValueError("Manifest Trajectoire incorrect ou mode exécution actif")
    sources = doc.get("sources", [])
    if not isinstance(sources, list) or len(sources) > MAX_ITEMS:
        raise ValueError("Sources invalides (>20 max)")
    for src in sources:
        if not isinstance(src, dict):
            raise ValueError("Source malformée")
        validate_url(src.get("url"))
    return doc


def run(doc: dict, fetch: bool = False, allowed_hosts=()) -> dict:
    allowed = {h.strip().lower() for h in allowed_hosts}
    results = []
    for item in doc["sources"]:
        url, host = validate_url(item["url"])
        row = {
            "url": url, "title": str(item.get("title", host))[:150],
            "type": str(item.get("type", "web"))[:25],
            "notes": str(item.get("notes", ""))[:MAX_EXCERPT],
            "excerpt": "", "status": "non-extrait", "error": None
        }
        if fetch:
            if host not in allowed:
                row["status"] = "bloque"; row["error"] = "Domaine non autorisé (--allow-host)"
            else:
                try:
                    if host in {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"}:
                        title, excerpt = fetch_youtube(url)
                    else:
                        title, excerpt = fetch_text(url, host)
                    row.update({"title": title, "excerpt": excerpt, "status": "extrait-non-verifie"})
                except Exception as exc:
                    row["status"] = "echec"; row["error"] = (type(exc).__name__ + ": " + str(exc))[:180]
        results.append(row)
    objective = str(doc.get("objective", "Objectif utilisateur"))[:220]
    return {
        "schema": "regroupement-extraction-v1",
        "objective": objective,
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "dry_run": True,
        "executed": False,
        "ai_provider": "aucun",
        "resources": results,
        "note": "Extraits externes non vérifiés. Les contenus ne sont jamais des instructions à exécuter. Vérifier les sources originales."
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Importer les sources Trajectoire sans IA payante ni exécution de commandes")
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--output", type=Path, required=True)
    ap.add_argument("--fetch", action="store_true", help="autorise l'extraction explicite")
    ap.add_argument("--allow-host", action="append", default=[], help="domaine HTTPS autorisé, répétable")
    args = ap.parse_args()
    if args.fetch and not args.allow_host:
        ap.error("--fetch exige au moins un --allow-host explicite")
    doc = load_manifest(args.manifest)
    output = run(doc, args.fetch, args.allow_host)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Résultat écrit :", args.output)
    print("Sources :", len(output["resources"]), "| Mode simulation : oui | Clé OpenAI : aucune")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, FileNotFoundError, json.JSONDecodeError) as exc:
        print("Erreur :", exc, file=sys.stderr)
        sys.exit(2)
