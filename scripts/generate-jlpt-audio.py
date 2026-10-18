# -*- coding: utf-8 -*-
"""JLPT 單元的日文發音檔（ElevenLabs，聲音 Saori，教學型日文女聲，正常速度 1.0）。

用法：
  ELEVENLABS_API_KEY=... python3 scripts/generate-jlpt-audio.py n5 1          # N5 第 1 單元，只補還沒有的
  ELEVENLABS_API_KEY=... python3 scripts/generate-jlpt-audio.py n5 1 word-3 listen-2   # 重做指定檔
產出 public/audio/jlpt-n5/unit1/ 底下：
  word-N.mp3      單字（唸假名 reading，跟單元頁的 🔊 一樣）
  ex-N.mp3        單字例句
  grammar-G-E.mp3 文法第 G 點的第 E 句例句
  listen-N.mp3    聽力題
  passage-N.mp3   閱讀短文
檔名規則要跟 src/app/jlpt-<level>/unit/[id]/ClientPage.tsx 的 audio map 一致。
public/audio 不進 git，做完要上傳 R2：
  rclone copy public/audio/jlpt-n5/unit1 r2:learn-audio/jlpt-n5/unit1 --progress
每支做完會用語音辨識聽一次並印出來；辨識結果跟原文差太多的會標 ??，要自己再聽過。
"""
import json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = "ozfS3gQtjFX3kQyJ12dX"  # Saori - Warm, Clear and Measured（教學型，Vega 2026-10-18 選定）


def items(level, unit):
    src = open(os.path.join(ROOT, f"src/data/jlpt-{level}-units/{level}unit{unit}.ts"), encoding="utf-8").read()
    out = []
    for i, m in enumerate(re.finditer(r'\{ ja: "[^"]*", reading: "([^"]*)",.*?\bex: "([^"]*)"', src), 1):
        out.append((f"word-{i}", m.group(1)))
        out.append((f"ex-{i}", m.group(2)))
    for g, m in enumerate(re.finditer(r'examples: \[(.*?)\]', src, re.S), 1):
        for e, s in enumerate(re.findall(r'"([^"]*)"', m.group(1)), 1):
            out.append((f"grammar-{g}-{e}", s))
    for i, s in enumerate(re.findall(r'\btext: "([^"]*)"', src), 1):
        out.append((f"listen-{i}", s))
    for i, s in enumerate(re.findall(r'\bpassage: "([^"]*)"', src), 1):
        out.append((f"passage-{i}", s))
    return out


def tts(text, path):
    body = json.dumps({
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "language_code": "ja",
        "voice_settings": {"stability": 0.6, "similarity_boost": 0.8, "speed": 1.0},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
        f.write(r.read())


def stt(path):
    boundary = "----jlptaudio"
    data = open(path, "rb").read()
    parts = [
        f'--{boundary}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="language_code"\r\n\r\nja\r\n'.encode(),
        f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode(),
        data, f"\r\n--{boundary}--\r\n".encode(),
    ]
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/speech-to-text", data=b"".join(parts),
        headers={"xi-api-key": KEY, "Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r).get("text", "")


def norm(s):
    return re.sub(r"[\s、。，．！？!?「」『』・]", "", s)


if __name__ == "__main__":
    level, unit = sys.argv[1], int(sys.argv[2])
    redo = set(sys.argv[3:])
    out_dir = os.path.join(ROOT, f"public/audio/jlpt-{level}/unit{unit}")
    os.makedirs(out_dir, exist_ok=True)
    todo = items(level, unit)
    bad = []
    for name, text in todo:
        path = os.path.join(out_dir, f"{name}.mp3")
        if os.path.exists(path) and name not in redo:
            continue
        tts(text, path)
        heard = stt(path)
        # 日文辨識會把假名寫成漢字（或反過來），不能逐字比對；長度差超過四成才當可疑
        a, b = norm(text), norm(heard)
        ok = abs(len(a) - len(b)) <= max(2, 0.4 * len(a))
        print(f'{"OK " if ok else "?? "}{name:14s} {text}' + ("" if ok else f"\n      聽到：{heard}"), flush=True)
        if not ok:
            bad.append(name)
    print(f"共 {len(todo)} 支；要再聽的：{bad or '無'}")
