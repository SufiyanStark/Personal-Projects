$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\models\clothing"
$cleanDir = Join-Path $sourceDir "clean"
New-Item -ItemType Directory -Force -Path $cleanDir | Out-Null

$code = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public sealed class AssetAudit
{
    public string Name;
    public int Width;
    public int Height;
    public string PixelFormat;
    public int FullyTransparent;
    public int PartiallyTransparent;
    public int FullyOpaque;
    public bool CornersTransparent;
    public double CheckerLikePercent;
    public string Classification;
    public int CleanTransparentPixels;
    public int CleanPartialPixels;
}

public static class AssetCleaner
{
    struct Pt { public int X; public int Y; public Pt(int x, int y) { X = x; Y = y; } }

    public static AssetAudit AuditAndClean(string inputPath, string outputPath)
    {
        using (var src = new Bitmap(inputPath))
        using (var dst = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb))
        {
            int w = src.Width;
            int h = src.Height;
            int count = w * h;
            var audit = new AssetAudit {
                Name = Path.GetFileName(inputPath),
                Width = w,
                Height = h,
                PixelFormat = src.PixelFormat.ToString()
            };

            int checkerLike = 0;
            int sampled = 0;
            int stepX = Math.Max(1, w / 120);
            int stepY = Math.Max(1, h / 80);
            for (int x = 0; x < w; x += stepX)
            {
                for (int y = 0; y < h; y += stepY)
                {
                    Color c = src.GetPixel(x, y);
                    if (c.A == 0) audit.FullyTransparent++;
                    else if (c.A < 255) audit.PartiallyTransparent++;
                    else audit.FullyOpaque++;
                    if (IsNeutralCheckerCandidate(c)) checkerLike++;
                    sampled++;
                }
            }

            audit.CornersTransparent =
                src.GetPixel(0, 0).A == 0 &&
                src.GetPixel(w - 1, 0).A == 0 &&
                src.GetPixel(0, h - 1).A == 0 &&
                src.GetPixel(w - 1, h - 1).A == 0;
            audit.CheckerLikePercent = Math.Round((double)checkerLike / sampled * 100, 1);
            audit.Classification = audit.FullyTransparent > 0 || audit.PartiallyTransparent > 0
                ? "A - TRUE TRANSPARENCY"
                : audit.CheckerLikePercent > 30
                    ? "B - FAKE TRANSPARENCY / CHECKERBOARD"
                    : "C - SOLID BACKGROUND";

            var background = ConnectedBackground(src);
            RemoveDetachedDebris(background, w, h);
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    int index = y * w + x;
                    Color c = src.GetPixel(x, y);
                    if (background[index])
                    {
                        dst.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
                        audit.CleanTransparentPixels++;
                    }
                    else
                    {
                        int alpha = HasBackgroundNeighbor(background, x, y, w, h) ? 226 : 255;
                        if (alpha < 255) audit.CleanPartialPixels++;
                        dst.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                    }
                }
            }

            dst.Save(outputPath, ImageFormat.Png);
            return audit;
        }
    }

    static bool[] ConnectedBackground(Bitmap src)
    {
        int w = src.Width;
        int h = src.Height;
        var bg = new bool[w * h];
        var visited = new bool[w * h];
        var q = new Queue<Pt>(w + h);
        var palette = BorderPalette(src);

        Action<int,int> seed = (x, y) => {
            int index = y * w + x;
            if (visited[index]) return;
            visited[index] = true;
            q.Enqueue(new Pt(x, y));
        };

        for (int x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
        for (int y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

        while (q.Count > 0)
        {
            Pt p = q.Dequeue();
            int index = p.Y * w + p.X;
            Color c = src.GetPixel(p.X, p.Y);
                if (!IsCheckerBackground(c, palette)) continue;

            bg[index] = true;
            if (p.X > 0) seed(p.X - 1, p.Y);
            if (p.X < w - 1) seed(p.X + 1, p.Y);
            if (p.Y > 0) seed(p.X, p.Y - 1);
            if (p.Y < h - 1) seed(p.X, p.Y + 1);
        }

        return bg;
    }

    static void RemoveDetachedDebris(bool[] bg, int w, int h)
    {
        var foreground = new bool[w * h];
        for (int i = 0; i < foreground.Length; i++) foreground[i] = !bg[i];

        var visited = new bool[w * h];
        var q = new Queue<Pt>();
        var component = new List<int>();
        int minArea = Math.Max(2200, (w * h) / 900);

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                int start = y * w + x;
                if (!foreground[start] || visited[start]) continue;

                visited[start] = true;
                q.Enqueue(new Pt(x, y));
                component.Clear();

                while (q.Count > 0)
                {
                    Pt p = q.Dequeue();
                    int index = p.Y * w + p.X;
                    component.Add(index);
                    Visit(p.X - 1, p.Y, foreground, visited, q, w, h);
                    Visit(p.X + 1, p.Y, foreground, visited, q, w, h);
                    Visit(p.X, p.Y - 1, foreground, visited, q, w, h);
                    Visit(p.X, p.Y + 1, foreground, visited, q, w, h);
                }

                if (component.Count < minArea)
                {
                    foreach (int index in component) bg[index] = true;
                }
            }
        }
    }

    static void Visit(int x, int y, bool[] foreground, bool[] visited, Queue<Pt> q, int w, int h)
    {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        int index = y * w + x;
        if (!foreground[index] || visited[index]) return;
        visited[index] = true;
        q.Enqueue(new Pt(x, y));
    }

    static List<Color> BorderPalette(Bitmap src)
    {
        int w = src.Width;
        int h = src.Height;
        var buckets = new Dictionary<int, int>();

        Action<Color> add = c => {
            if (!IsNeutralCheckerCandidate(c)) return;
            int key = (c.R / 12) * 65536 + (c.G / 12) * 256 + (c.B / 12);
            buckets[key] = buckets.ContainsKey(key) ? buckets[key] + 1 : 1;
        };

        int stepX = Math.Max(1, w / 260);
        int stepY = Math.Max(1, h / 180);
        for (int x = 0; x < w; x += stepX)
        {
            add(src.GetPixel(x, 0));
            add(src.GetPixel(x, h - 1));
        }
        for (int y = 0; y < h; y += stepY)
        {
            add(src.GetPixel(0, y));
            add(src.GetPixel(w - 1, y));
        }

        var top = new List<KeyValuePair<int, int>>(buckets);
        top.Sort((a, b) => b.Value.CompareTo(a.Value));
        var colors = new List<Color>();
        for (int i = 0; i < Math.Min(10, top.Count); i++)
        {
            int r = ((top[i].Key / 65536) * 12) + 6;
            int g = (((top[i].Key / 256) % 256) * 12) + 6;
            int b = ((top[i].Key % 256) * 12) + 6;
            colors.Add(Color.FromArgb(Math.Min(255, r), Math.Min(255, g), Math.Min(255, b)));
        }

        return colors;
    }

    static bool IsNeutralCheckerCandidate(Color c)
    {
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        int min = Math.Min(c.R, Math.Min(c.G, c.B));
        double lum = 0.2126 * c.R + 0.7152 * c.G + 0.0722 * c.B;
        return (max - min) <= 24 && lum >= 34;
    }

    static bool IsCheckerBackground(Color c, List<Color> palette)
    {
        if (!IsNeutralCheckerCandidate(c)) return false;

        foreach (Color p in palette)
        {
            int dr = c.R - p.R;
            int dg = c.G - p.G;
            int db = c.B - p.B;
            if (Math.Sqrt(dr * dr + dg * dg + db * db) <= 24) return true;
        }

        return false;
    }

    static bool HasBackgroundNeighbor(bool[] bg, int x, int y, int w, int h)
    {
        for (int oy = -1; oy <= 1; oy++)
        {
            for (int ox = -1; ox <= 1; ox++)
            {
                int nx = x + ox;
                int ny = y + oy;
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                if (bg[ny * w + nx]) return true;
            }
        }
        return false;
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$assets = Get-ChildItem -LiteralPath $sourceDir -Filter *.png |
  Where-Object { $_.Name -match '^(hoodie|tshirt|shirt|jacket|trousers|coat)-0[1-4]\.png$' } |
  Sort-Object Name

$audits = foreach ($asset in $assets) {
  [AssetCleaner]::AuditAndClean($asset.FullName, (Join-Path $cleanDir $asset.Name))
}

$audits |
  Select-Object Name, Width, Height, PixelFormat, FullyTransparent, PartiallyTransparent, FullyOpaque, CornersTransparent, CheckerLikePercent, Classification, CleanTransparentPixels, CleanPartialPixels |
  ConvertTo-Csv -NoTypeInformation |
  Set-Content -Path (Join-Path $cleanDir "audit.csv") -Encoding UTF8

$audits |
  Select-Object Name, Width, Height, PixelFormat, FullyTransparent, PartiallyTransparent, FullyOpaque, CornersTransparent, CheckerLikePercent, Classification, CleanTransparentPixels, CleanPartialPixels |
  Format-Table -AutoSize
