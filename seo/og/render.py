# Renders share images with headless Chrome: python3 seo/og/render.py jobs.json
import json, sys, subprocess, urllib.parse, os, concurrent.futures
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "..", "assets", "og")
os.makedirs(out, exist_ok=True)
jobs = json.load(open(sys.argv[1]))
def run(job):
    name, params = job
    png = f"/tmp/og-{name}.png"
    url = "file://" + os.path.join(here, "og.html") + ("?" + urllib.parse.urlencode(params) if params else "")
    subprocess.run(["google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                    "--window-size=1200,630", "--allow-file-access-from-files", "--virtual-time-budget=2500", f"--user-data-dir=/tmp/chr-{name}",
                    f"--screenshot={png}", url], capture_output=True, timeout=90)
    Image.open(png).convert("RGB").save(os.path.join(out, name + ".jpg"), quality=84, optimize=True, progressive=True)
    os.remove(png); subprocess.run(["rm", "-rf", f"/tmp/chr-{name}"])
    return name
with concurrent.futures.ThreadPoolExecutor(6) as ex:
    done = list(ex.map(run, jobs))
print(len(done), "rendered")
