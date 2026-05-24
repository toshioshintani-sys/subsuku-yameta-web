# -*- coding: utf-8 -*-
"""
GA4 OAuth re-authentication.
失効した refresh_token を再発行する。

実行：python -X utf8 monitoring/scripts/reauth_ga4.py
  → ブラウザが開く → Googleでログイン → アクセス許可
  → monitoring/config/adc.json に新しい refresh_token が書き込まれる
"""
from __future__ import annotations
import json, os, sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ADC_PATH = SCRIPT_DIR.parent / "config" / "adc.json"
CLIENT_PATH = Path(os.environ.get("USERPROFILE", os.path.expanduser("~"))) / ".life-oracle" / "oauth-desktop-client.json"

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]


def _ensure_lib():
    try:
        import google_auth_oauthlib  # noqa
    except ImportError:
        import subprocess
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install",
             "google-auth-oauthlib", "--break-system-packages", "-q"])


def main():
    if not CLIENT_PATH.exists():
        print(f"ERROR: OAuth client file not found: {CLIENT_PATH}", file=sys.stderr)
        print("Google Cloud Console で OAuth 2.0 クライアントID（デスクトップアプリ）を作成し、", file=sys.stderr)
        print(f"JSON を {CLIENT_PATH} に保存してください。", file=sys.stderr)
        return 1

    _ensure_lib()
    from google_auth_oauthlib.flow import InstalledAppFlow

    print("ブラウザを開いてGoogle認証を行います。アカウント: toshio.shintani@gmail.com")
    print("（life-oracle.jp の GA4 プロパティに閲覧者権限があるアカウントを選んでください）")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_PATH), SCOPES)
    creds = flow.run_local_server(port=0, open_browser=True)

    client_info = json.loads(CLIENT_PATH.read_text(encoding="utf-8"))
    inst = client_info.get("installed") or client_info.get("web") or {}

    adc = {
        "type": "authorized_user",
        "client_id": inst.get("client_id", creds.client_id),
        "client_secret": inst.get("client_secret", creds.client_secret),
        "refresh_token": creds.refresh_token,
        "token_uri": "https://oauth2.googleapis.com/token",
        "universe_domain": "googleapis.com",
    }

    ADC_PATH.parent.mkdir(parents=True, exist_ok=True)
    ADC_PATH.write_text(json.dumps(adc, indent=2), encoding="utf-8")
    print(f"\n✅ 新しい refresh_token を保存しました: {ADC_PATH}")
    print("次のコマンドで動作確認できます:")
    print(f'  python -X utf8 "{SCRIPT_DIR / "collect_ga4.py"}"')
    return 0


if __name__ == "__main__":
    sys.exit(main())
