# -*- coding: utf-8 -*-
"""首頁「每週一句英文」的發音檔（ElevenLabs，跟英檢單字同一個聲音）。

用法：
  ELEVENLABS_API_KEY=... python3 scripts/generate-weekly-english-audio.py        # 只補還沒有的
  ELEVENLABS_API_KEY=... python3 scripts/generate-weekly-english-audio.py 3 17   # 重做第 3、17 句
產出 public/audio/weekly-english/01.mp3 …（第幾句就是 weekly-english.ts 裡的順序，從 1 算）。
public/audio 不進 git，做完要上傳 R2：
  rclone copy public/audio/weekly-english r2:learn-audio/weekly-english --progress
每支做完會用語音辨識聽一次，跟原句不一樣的會列出來，要自己再聽過。
"""
import json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = "XfNU2rGpBa01ckF309OY"
OUT = os.path.join(ROOT, "public/audio/weekly-english")


def sentences():
    src = open(os.path.join(ROOT, "src/data/weekly-english.ts"), encoding="utf-8").read()
    return re.findall(r'\{ type: "(?:句型|諺語)", en: "((?:[^"\\]|\\.)*)"', src)


def tts(text, path):
    body = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "language_code": "en",
        "voice_settings": {"stability": 0.95, "similarity_boost": 0.8, "speed": 0.92},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
        f.write(r.read())


def stt(path):
    boundary = "----weeklyenglish"
    data = open(path, "rb").read()
    parts = [
        f'--{boundary}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\nen\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode(),
        data, f"\r\n--{boundary}--\r\n".encode(),
    ]
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/speech-to-text", data=b"".join(parts),
        headers={"xi-api-key": KEY, "Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r).get("text", "")


def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower().replace("’", "'").replace("'", "")).split()


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    sents = sentences()
    redo = {int(a) for a in sys.argv[1:]}
    bad = []
    for i, text in enumerate(sents, 1):
        path = os.path.join(OUT, f"{i:02d}.mp3")
        if os.path.exists(path) and i not in redo:
            continue
        tts(text, path)
        heard = stt(path)
        ok = norm(heard) == norm(text)
        print(f'{"OK " if ok else "?? "}{i:02d} {text}' + ("" if ok else f"\n      聽到：{heard}"))
        if not ok:
            bad.append(i)
    print(f"共 {len(sents)} 句；要再聽的：{bad or '無'}")
